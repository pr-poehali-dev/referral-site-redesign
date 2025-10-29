import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление заявками на вывод средств
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с заявками на вывод
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
            user_id = body_data.get('user_id')
            phone = body_data.get('phone')
            bank = body_data.get('bank')
            amount = body_data.get('amount')
            
            if not all([user_id, phone, bank, amount]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute(
                "SELECT total_earned FROM users WHERE user_id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            
            if not user or user['total_earned'] < amount:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Insufficient funds'})
                }
            
            cur.execute(
                """
                INSERT INTO withdrawal_requests (user_id, phone, bank, amount, status)
                VALUES (%s, %s, %s, %s, 'pending')
                RETURNING id
                """,
                (user_id, phone, bank, amount)
            )
            request_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'request_id': request_id
                })
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            admin = params.get('admin') == 'true'
            
            if admin:
                cur.execute(
                    """
                    SELECT id, user_id, phone, bank, amount, status, created_at
                    FROM withdrawal_requests
                    ORDER BY created_at DESC
                    """
                )
            elif user_id:
                cur.execute(
                    """
                    SELECT id, phone, bank, amount, status, created_at
                    FROM withdrawal_requests
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    """,
                    (user_id,)
                )
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id or admin required'})
                }
            
            requests = cur.fetchall()
            requests_list = []
            
            for req in requests:
                requests_list.append({
                    'id': req['id'],
                    'user': req.get('user_id', ''),
                    'phone': req['phone'],
                    'bank': req['bank'],
                    'amount': req['amount'],
                    'status': req['status'],
                    'date': req['created_at'].strftime('%Y-%m-%d') if req['created_at'] else ''
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'requests': requests_list})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            request_id = body_data.get('request_id')
            status = body_data.get('status')
            
            if status not in ['approved', 'rejected']:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid status'})
                }
            
            cur.execute(
                """
                UPDATE withdrawal_requests
                SET status = %s, processed_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING user_id, amount
                """,
                (status, request_id)
            )
            result = cur.fetchone()
            
            if result and status == 'approved':
                cur.execute(
                    """
                    UPDATE users
                    SET total_earned = total_earned - %s
                    WHERE user_id = %s
                    """,
                    (result['amount'], result['user_id'])
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True})
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
