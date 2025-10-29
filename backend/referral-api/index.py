import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any
import secrets
import string

def generate_referral_code(length: int = 8) -> str:
    characters = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Реферальная система - регистрация пользователей, получение статистики, управление рефералами
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными пользователя и рефералов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                user_id = body_data.get('user_id')
                phone = body_data.get('phone')
                referred_by = body_data.get('referred_by')
                
                referral_code = generate_referral_code()
                
                cur.execute(
                    "SELECT user_id FROM users WHERE user_id = %s",
                    (user_id,)
                )
                existing_user = cur.fetchone()
                
                if existing_user:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'User already exists'})
                    }
                
                cur.execute(
                    """
                    INSERT INTO users (user_id, phone, referral_code, referred_by)
                    VALUES (%s, %s, %s, %s)
                    RETURNING user_id, referral_code
                    """,
                    (user_id, phone, referral_code, referred_by)
                )
                new_user = cur.fetchone()
                
                if referred_by:
                    cur.execute(
                        """
                        INSERT INTO referrals (referrer_id, referee_id, status)
                        VALUES (%s, %s, 'pending')
                        """,
                        (referred_by, user_id)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'user_id': new_user['user_id'],
                        'referral_code': new_user['referral_code']
                    })
                }
            
            elif action == 'update_status':
                user_id = body_data.get('user_id')
                card_ordered = body_data.get('card_ordered')
                card_activated = body_data.get('card_activated')
                first_purchase = body_data.get('first_purchase_completed')
                
                update_fields = []
                update_values = []
                
                if card_ordered is not None:
                    update_fields.append('card_ordered = %s')
                    update_values.append(card_ordered)
                
                if card_activated is not None:
                    update_fields.append('card_activated = %s')
                    update_values.append(card_activated)
                
                if first_purchase is not None:
                    update_fields.append('first_purchase_completed = %s')
                    update_values.append(first_purchase)
                
                if update_fields:
                    update_values.append(user_id)
                    query = f"UPDATE users SET {', '.join(update_fields)} WHERE user_id = %s"
                    cur.execute(query, update_values)
                    
                    if first_purchase:
                        cur.execute(
                            """
                            UPDATE referrals 
                            SET status = 'completed', earned = 200, completed_at = CURRENT_TIMESTAMP
                            WHERE referee_id = %s AND status = 'pending'
                            RETURNING referrer_id
                            """,
                            (user_id,)
                        )
                        referrer = cur.fetchone()
                        
                        if referrer:
                            cur.execute(
                                """
                                UPDATE users 
                                SET total_earned = total_earned + 200
                                WHERE user_id = %s
                                """,
                                (referrer['referrer_id'],)
                            )
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({'success': True})
                    }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id required'})
                }
            
            cur.execute(
                """
                SELECT user_id, referral_code, total_earned, pending_earned,
                       card_ordered, card_activated, first_purchase_completed
                FROM users WHERE user_id = %s
                """,
                (user_id,)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            cur.execute(
                """
                SELECT r.id, r.referee_id, r.status, r.earned, r.created_at,
                       u.phone as referee_phone
                FROM referrals r
                LEFT JOIN users u ON r.referee_id = u.user_id
                WHERE r.referrer_id = %s
                ORDER BY r.created_at DESC
                """,
                (user_id,)
            )
            referrals = cur.fetchall()
            
            total_referrals = len(referrals)
            completed_referrals = sum(1 for r in referrals if r['status'] == 'completed')
            pending_count = sum(1 for r in referrals if r['status'] == 'pending')
            
            referrals_list = []
            for idx, ref in enumerate(referrals):
                referrals_list.append({
                    'id': ref['id'],
                    'name': f'Друг {idx + 1}',
                    'status': ref['status'],
                    'earned': ref['earned'],
                    'date': ref['created_at'].strftime('%Y-%m-%d') if ref['created_at'] else ''
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'user': {
                        'user_id': user['user_id'],
                        'referral_code': user['referral_code'],
                        'total_earned': user['total_earned'],
                        'pending_earned': pending_count * 200
                    },
                    'stats': {
                        'totalReferrals': total_referrals,
                        'completedReferrals': completed_referrals,
                        'totalEarned': user['total_earned'],
                        'pendingEarned': pending_count * 200
                    },
                    'referrals': referrals_list
                })
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
