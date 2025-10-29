-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by VARCHAR(50),
    total_earned INTEGER DEFAULT 0,
    pending_earned INTEGER DEFAULT 0,
    card_ordered BOOLEAN DEFAULT FALSE,
    card_activated BOOLEAN DEFAULT FALSE,
    first_purchase_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы рефералов
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id VARCHAR(50) NOT NULL,
    referee_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(user_id),
    FOREIGN KEY (referee_id) REFERENCES users(user_id)
);

-- Создание таблицы заявок на вывод
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    bank VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_user ON withdrawal_requests(user_id);