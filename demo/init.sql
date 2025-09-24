-- Tạo database cho ITInterviewPro
CREATE DATABASE itinterviewpro_db;

-- Kết nối đến database mới
\c itinterviewpro_db;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng phiên phỏng vấn
CREATE TABLE IF NOT EXISTS interview_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Bảng câu hỏi phỏng vấn
CREATE TABLE IF NOT EXISTS interview_questions (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES interview_sessions(id),
    question_text TEXT NOT NULL,
    question_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng câu trả lời và đánh giá
CREATE TABLE IF NOT EXISTS interview_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES interview_sessions(id),
    question_id INTEGER REFERENCES interview_questions(id),
    user_answer TEXT NOT NULL,
    evaluation_score INTEGER,
    evaluation_feedback TEXT,
    evaluation_suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tiến độ học tập
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    last_interview_date TIMESTAMP WITH TIME ZONE,
    average_score DECIMAL(3,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_questions_session_id ON interview_questions(session_id);
CREATE INDEX idx_interview_answers_session_id ON interview_answers(session_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Thêm dữ liệu demo
INSERT INTO users (email, name) VALUES 
('demo@example.com', 'Demo User'),
('test@example.com', 'Test User');

INSERT INTO user_progress (user_id, total_questions, correct_answers, total_sessions, average_score) VALUES 
('demo_user_123', 5, 3, 2, 7.50),
('test_user_456', 10, 8, 3, 8.20);

