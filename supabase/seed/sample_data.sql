-- Insert sample users
INSERT INTO users (id, email, name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@kgsaudit.com', 'Admin User', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'auditor@kgsaudit.com', 'Senior Auditor', 'auditor'),
('550e8400-e29b-41d4-a716-446655440003', 'manager@kgsaudit.com', 'Audit Manager', 'audit_manager'),
('550e8400-e29b-41d4-a716-446655440004', 'client@company.com', 'Client User', 'client');

-- Insert sample accreditation standards
INSERT INTO accreditation_standards (code, title, description, version) VALUES
('ISO 9001', 'Quality Management Systems', 'Requirements for a quality management system', '2015'),
('ISO 14001', 'Environmental Management Systems', 'Requirements for an environmental management system', '2015'),
('ISO 45001', 'Occupational Health and Safety', 'Occupational health and safety management systems', '2018'),
('ISO 27001', 'Information Security Management', 'Information security management systems', '2022');

-- Insert sample document types
INSERT INTO document_types (name, description, is_required, expiry_required) VALUES
('Quality Manual', 'Organization quality management manual', true, false),
('Procedures', 'Standard operating procedures', true, false),
('Work Instructions', 'Detailed work instructions', false, false),
('Forms', 'Quality management forms', false, false),
('Training Records', 'Employee training documentation', true, false),
('Audit Reports', 'Internal and external audit reports', true, false),
('Certificates', 'Compliance certificates', true, true);

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, address, industry, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Manufacturing Corp', 'info@manufacturing.com', '+1-555-0101', '123 Industrial Ave, City, State', 'Manufacturing', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440002', 'Tech Solutions Ltd', 'contact@techsolutions.com', '+1-555-0102', '456 Innovation Blvd, City, State', 'Technology', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440003', 'Healthcare Plus', 'admin@healthcareplus.com', '+1-555-0103', '789 Medical Center Dr, City, State', 'Healthcare', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample auditor profiles
INSERT INTO auditor_profiles (user_id, qualifications, certifications, experience_years, specializations, bio, is_approved, approved_by) VALUES
('550e8400-e29b-41d4-a716-446655440002', 
 ARRAY['Lead Auditor', 'Quality Manager'],
 '{"iso_9001": {"certificate_id": "LA-9001-001", "expiry": "2025-12-31"}}',
 8,
 ARRAY['ISO 9001', 'ISO 14001'],
 'Experienced auditor with 8+ years in quality management systems',
 true,
 '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample audits
INSERT INTO audits (client_id, audit_type, status, start_date, end_date, scope, objectives, lead_auditor_id, team_members, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'iso_9001', 'planning', '2024-02-01T09:00:00Z', '2024-02-05T17:00:00Z', 'All production processes', 'Verify compliance with ISO 9001:2015 requirements', '550e8400-e29b-41d4-a716-446655440002', ARRAY['550e8400-e29b-41d4-a716-446655440002'], '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440002', 'iso_27001', 'execution', '2024-01-15T09:00:00Z', '2024-01-19T17:00:00Z', 'IT infrastructure and data management', 'Assess information security management system', '550e8400-e29b-41d4-a716-446655440002', ARRAY['550e8400-e29b-41d4-a716-446655440002'], '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample system settings
INSERT INTO system_settings (key, value, description, is_public, updated_by) VALUES
('company_name', 'KGS Audit Pro', 'Company name displayed in the application', true, '550e8400-e29b-41d4-a716-446655440001'),
('audit_reminder_days', '7', 'Days before audit to send reminder', false, '550e8400-e29b-41d4-a716-446655440001'),
('max_file_size', '10485760', 'Maximum file upload size in bytes', false, '550e8400-e29b-41d4-a716-446655440001'),
('allowed_file_types', 'pdf,doc,docx,xls,xlsx,png,jpg,jpeg', 'Allowed file extensions for uploads', false, '550e8400-e29b-41d4-a716-446655440001');
