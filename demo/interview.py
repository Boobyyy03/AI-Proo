from flask import Blueprint, request, jsonify
import requests
import jwt
import os
from datetime import datetime

interview_bp = Blueprint('interview', __name__)

# Cấu hình N8N webhook URL
N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook/interview')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key_here')

@interview_bp.route('/start_interview', methods=['POST'])
def start_interview():
    """Bắt đầu phiên phỏng vấn mới"""
    try:
        # Lấy dữ liệu từ request
        data = request.get_json()
        
        # Lấy JWT token từ header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Chuẩn bị payload để gửi đến N8N
        payload = {
            'action': 'start_interview',
            'specialization': data.get('specialization'),
            'difficulty': data.get('difficulty', 'medium'),
            'headers': {
                'authorization': auth_header
            }
        }
        
        # Gửi request đến N8N webhook
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'N8N workflow failed', 'details': response.text}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/get_question', methods=['POST'])
def get_question():
    """Lấy câu hỏi mới"""
    try:
        data = request.get_json()
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        payload = {
            'action': 'get_question',
            'session_id': data.get('session_id'),
            'specialization': data.get('specialization'),
            'difficulty': data.get('difficulty', 'medium'),
            'previous_questions_context': data.get('previous_questions_context', ''),
            'headers': {
                'authorization': auth_header
            }
        }
        
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'N8N workflow failed', 'details': response.text}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/save_result', methods=['POST'])
def save_result():
    """Lưu kết quả câu trả lời và nhận đánh giá"""
    try:
        data = request.get_json()
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        payload = {
            'action': 'save_result',
            'session_id': data.get('session_id'),
            'question': data.get('question'),
            'user_answer': data.get('user_answer'),
            'headers': {
                'authorization': auth_header
            }
        }
        
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'N8N workflow failed', 'details': response.text}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/get_progress', methods=['GET'])
def get_progress():
    """Lấy tiến độ học tập của người dùng"""
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        payload = {
            'action': 'get_progress',
            'headers': {
                'authorization': auth_header
            }
        }
        
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'N8N workflow failed', 'details': response.text}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/auth/login', methods=['POST'])
def login():
    """Đăng nhập và tạo JWT token (demo)"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Đây là demo login - trong thực tế cần kiểm tra với database
        if email and password:
            # Tạo JWT token
            payload = {
                'user_id': 'demo_user_123',
                'email': email,
                'exp': datetime.utcnow().timestamp() + 3600  # Token hết hạn sau 1 giờ
            }
            
            token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'status': 'success',
                'token': token,
                'user': {
                    'user_id': 'demo_user_123',
                    'email': email
                }
            })
        else:
            return jsonify({'error': 'Email and password required'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

