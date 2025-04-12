from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
import os
import uuid
import datetime
import json
import tempfile
from google.generativeai import GenerativeModel
import google.generativeai as genai
import speech_recognition as sr
from pydub import AudioSegment
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shachi2374@localhost/VOCALRESUME'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'my-very-secret-key'  
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Set to True in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Google Gemini API
GOOGLE_API_KEY ="AIzaSyCBFjdTgW5BPygD7QgR13WiQxeFVgvG0XQ"
genai.configure(api_key=GOOGLE_API_KEY)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    resumes = db.relationship('Resume', backref='user', lazy=True)

class Resume(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    template_id = db.Column(db.Integer, nullable=False)
    template_name = db.Column(db.String(50), nullable=False)
    resume_data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

# Template mapping
TEMPLATES = {
    1: "Professional",
    2: "Creative",
    3: "Minimal",
    4: "Executive"
}

# Helper Functions
def transcribe_audio(audio_file):
    """Transcribe audio file to text using speech recognition"""
    recognizer = sr.Recognizer()
    
    # Convert audio file to WAV format if needed
    if audio_file.filename.endswith('.mp3'):
        audio = AudioSegment.from_mp3(audio_file)
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        with sr.AudioFile(wav_io) as source:
            audio_data = recognizer.record(source)
    else:
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
    
    try:
        # Use Google's speech recognition
        text = recognizer.recognize_google(audio_data)
        return text
    except Exception as e:
        print(f"Error in speech recognition: {e}")
        return None

def process_with_gemini(transcript, template_id):
    """Process transcript with Gemini API to generate resume JSON"""
    model = GenerativeModel('gemini-1.5-pro')
    
    # Define the resume structure based on template
    resume_structure = {
        "personalInfo": {
            "name": "",
            "title": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": ""
        },
        "summary": "",
        "experience": [
            {
                "title": "",
                "company": "",
                "dates": "",
                "location": "",
                "description": ""
            }
        ],
        "education": [
            {
                "degree": "",
                "institution": "",
                "dates": "",
                "location": ""
            }
        ],
        "skills": []
    }
    
    # Create prompt for Gemini
    prompt = f"""
    You are a professional resume writer. Extract relevant information from the following transcript and format it into a JSON resume.
    
    Here's the transcript: {transcript}
    
    Please format the response as a valid JSON object with the following structure:
    {json.dumps(resume_structure, indent=2)}
    
    Fill in all relevant fields based on the transcript. If information for a field is not available, leave it empty.
    For the experience and education sections, create as many entries as mentioned in the transcript.
    For skills, extract all relevant skills mentioned.
    
    ONLY return the JSON object, nothing else.
    """
    
    try:
        response = model.generate_content(prompt)
        # Extract JSON from response
        response_text = response.text
        
        # Find JSON in the response (it might be wrapped in code blocks)
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()
        else:
            json_str = response_text.strip()
        
        resume_data = json.loads(json_str)
        
        # Add template information
        resume_data["templateId"] = template_id
        resume_data["templateName"] = TEMPLATES.get(int(template_id), "Professional")
        print(resume_data)
        return resume_data
    except Exception as e:
        print(f"Error processing with Gemini: {e}")
        return None

def generate_pdf(resume_data, template_id):
    """Generate PDF from resume data based on template"""
    # Create a temporary file to store the PDF
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
        pdf_path = temp_file.name
    
    # Get template style
    template_name = TEMPLATES.get(int(template_id), "Professional")
    
    # Create PDF document
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Add custom styles based on template
    if template_name == "Professional":
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.navy,
            spaceAfter=12
        )
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.navy,
            spaceAfter=6
        )
        normal_style = styles['Normal']
        
    elif template_name == "Creative":
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.purple,
            spaceAfter=12
        )
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.purple,
            spaceAfter=6
        )
        normal_style = styles['Normal']
        
    elif template_name == "Minimal":
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.black,
            spaceAfter=12
        )
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.black,
            spaceAfter=6
        )
        normal_style = styles['Normal']
        
    else:  # Executive
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.darkblue,
            spaceAfter=12
        )
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.darkblue,
            spaceAfter=6
        )
        normal_style = styles['Normal']
    
    # Personal Information
    personal_info = resume_data.get('personalInfo', {})
    elements.append(Paragraph(personal_info.get('name', ''), title_style))
    
    # Contact information
    contact_info = []
    if personal_info.get('email'):
        contact_info.append(personal_info['email'])
    if personal_info.get('phone'):
        contact_info.append(personal_info['phone'])
    if personal_info.get('location'):
        contact_info.append(personal_info['location'])
    
    if contact_info:
        elements.append(Paragraph(' | '.join(contact_info), normal_style))
    
    elements.append(Spacer(1, 0.2 * inch))
    
    # Summary
    if resume_data.get('summary'):
        elements.append(Paragraph('PROFESSIONAL SUMMARY', heading_style))
        elements.append(Paragraph(resume_data['summary'], normal_style))
        elements.append(Spacer(1, 0.2 * inch))
    
    # Experience
    if resume_data.get('experience'):
        elements.append(Paragraph('EXPERIENCE', heading_style))
        for exp in resume_data['experience']:
            job_title = exp.get('title', '')
            company = exp.get('company', '')
            dates = exp.get('dates', '')
            location = exp.get('location', '')
            
            job_header = f"<b>{job_title}</b>"
            if company:
                job_header += f", {company}"
            
            elements.append(Paragraph(job_header, normal_style))
            
            if dates or location:
                date_loc = []
                if dates:
                    date_loc.append(dates)
                if location:
                    date_loc.append(location)
                elements.append(Paragraph(' | '.join(date_loc), normal_style))
            
            if exp.get('description'):
                elements.append(Paragraph(exp['description'], normal_style))
            
            elements.append(Spacer(1, 0.1 * inch))
        
        elements.append(Spacer(1, 0.1 * inch))
    
    # Education
    if resume_data.get('education'):
        elements.append(Paragraph('EDUCATION', heading_style))
        for edu in resume_data['education']:
            degree = edu.get('degree', '')
            institution = edu.get('institution', '')
            dates = edu.get('dates', '')
            location = edu.get('location', '')
            
            edu_header = f"<b>{degree}</b>"
            if institution:
                edu_header += f", {institution}"
            
            elements.append(Paragraph(edu_header, normal_style))
            
            if dates or location:
                date_loc = []
                if dates:
                    date_loc.append(dates)
                if location:
                    date_loc.append(location)
                elements.append(Paragraph(' | '.join(date_loc), normal_style))
            
            elements.append(Spacer(1, 0.1 * inch))
        
        elements.append(Spacer(1, 0.1 * inch))
    
    # Skills
    if resume_data.get('skills'):
        elements.append(Paragraph('SKILLS', heading_style))
        skills_text = ', '.join(resume_data['skills'])
        elements.append(Paragraph(skills_text, normal_style))
    
    # Build the PDF
    doc.build(elements)
    
    return pdf_path

# Routes
@app.route('/api/signup', methods=['POST'])
def signup():
    print("hi")
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    print(f"Received signup data: {data}")
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 409
    
    # Create new user
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Create access token
    # access_token = create_access_token(identity=user.id)
    access_token = create_access_token(identity=str(user.id))

    
    response = jsonify({'message': 'Login successful'})
    set_access_cookies(response, access_token)
    print(access_token)
    return response, 200

@app.route('/api/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)
    return response, 200

@app.route('/api/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    current_user_id = get_jwt_identity()
    # current_user_id = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NDI5MjI4MywianRpIjoiNmM5ZWFlMmMtMmYwZC00ZDgxLWE2MGMtZTdmZmE1ODZhM2Y3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzQ0MjkyMjgzLCJleHAiOjE3NDQzNzg2ODN9.Cl7Ll5dwJW1GqcOACjo5z70XWAkd5JoeoHFy9lwUWHg"
    print(f"Authenticated user ID: {current_user_id}")
    return jsonify({'authenticated': True, 'user_id': current_user_id}), 200

@app.route('/api/process-audio', methods=['POST'])
@jwt_required()
def process_audio():
    current_user_id = get_jwt_identity()
    
    if 'audio' not in request.files:
        return jsonify({'message': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    template_id = request.form.get('templateId', '1')
    
    if not audio_file.filename:
        return jsonify({'message': 'No audio file selected'}), 400
    
    # Save audio file temporarily
    audio_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{uuid.uuid4()}{os.path.splitext(audio_file.filename)[1]}")
    audio_file.save(audio_path)
    
    try:
        # Transcribe audio to text
        with open(audio_path, 'rb') as audio:
            transcript = transcribe_audio(audio)
        
        if not transcript:
            return jsonify({'message': 'Failed to transcribe audio'}), 500
        
        # Process transcript with Gemini
        resume_data = process_with_gemini(transcript, template_id)
        
        if not resume_data:
            return jsonify({'message': 'Failed to process transcript'}), 500
        
        # Save resume to database
        new_resume = Resume(
            user_id=current_user_id,
            template_id=int(template_id),
            template_name=TEMPLATES.get(int(template_id), "Professional"),
            resume_data=json.dumps(resume_data)
        )
        
        db.session.add(new_resume)
        db.session.commit()
        
        return jsonify({
            'message': 'Resume created successfully',
            'resumeId': new_resume.id
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error processing audio: {str(e)}'}), 500
    
    finally:
        # Clean up temporary file
        if os.path.exists(audio_path):
            os.remove(audio_path)

@app.route('/api/resume/<resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    resume_data = json.loads(resume.resume_data)
    resume_data['id'] = resume.id
    resume_data['templateId'] = resume.template_id
    resume_data['templateName'] = resume.template_name
    resume_data['createdAt'] = resume.created_at.isoformat()
    resume_data['updatedAt'] = resume.updated_at.isoformat()
    
    return jsonify(resume_data), 200

@app.route('/api/resume/<resume_id>', methods=['PUT'])
@jwt_required()
def update_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    data = request.json
    
    # Update resume data
    resume.resume_data = json.dumps(data)
    resume.updated_at = datetime.datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Resume updated successfully'}), 200

@app.route('/api/resume/<resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    db.session.delete(resume)
    db.session.commit()
    
    return jsonify({'message': 'Resume deleted successfully'}), 200

@app.route('/api/resume/<resume_id>/save', methods=['POST'])
@jwt_required()
def save_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    # Update timestamp
    resume.updated_at = datetime.datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Resume saved successfully'}), 200

@app.route('/api/resume/<resume_id>/download', methods=['GET'])
@jwt_required()
def download_resume(resume_id):
    current_user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    resume_data = json.loads(resume.resume_data)
    
    # Generate PDF
    pdf_path = generate_pdf(resume_data, resume.template_id)
    
    try:
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=f"resume_{resume_id}.pdf",
            mimetype='application/pdf'
        )
    finally:
        # Clean up temporary file after sending
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)

@app.route('/api/resumes', methods=['GET'])
@jwt_required()
def get_user_resumes():
    current_user_id = get_jwt_identity()
    
    resumes = Resume.query.filter_by(user_id=current_user_id).order_by(Resume.updated_at.desc()).all()
    
    resume_list = []
    for resume in resumes:
        resume_list.append({
            'id': resume.id,
            'templateId': resume.template_id,
            'templateName': resume.template_name,
            'createdAt': resume.created_at.isoformat(),
            'updatedAt': resume.updated_at.isoformat()
        })
    
    return jsonify({'resumes': resume_list}), 200

@app.route('/api/preview-template/<int:template_id>', methods=['GET'])
def preview_template(template_id):
    # This would return a sample resume for the given template
    # For simplicity, we'll just return a message
    return jsonify({
        'message': f'Preview for template {template_id} - {TEMPLATES.get(template_id, "Unknown")}'
    }), 200

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
