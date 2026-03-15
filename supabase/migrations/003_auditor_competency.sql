-- Create auditor_profiles table
CREATE TABLE auditor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  qualifications TEXT[],
  certifications JSONB,
  experience_years INTEGER DEFAULT 0,
  specializations TEXT[],
  bio TEXT,
  cv_file_path VARCHAR(500),
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_records table
CREATE TABLE training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auditor_id UUID NOT NULL REFERENCES auditor_profiles(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  duration_hours INTEGER,
  certificate_file_path VARCHAR(500),
  competency_area VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cpd_records table
CREATE TABLE cpd_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auditor_id UUID NOT NULL REFERENCES auditor_profiles(user_id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('training', 'conference', 'self_study', 'mentoring', 'other')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cpd_hours DECIMAL(4,2) NOT NULL,
  activity_date DATE NOT NULL,
  evidence_file_path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE auditor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpd_records ENABLE ROW LEVEL SECURITY;

-- Create policies for auditor_profiles
CREATE POLICY "Users can view auditor profiles" ON auditor_profiles
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager') OR
    user_id = auth.uid() OR
    is_approved = true
  );

CREATE POLICY "Auditors can manage own profile" ON auditor_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins and managers can manage auditor profiles" ON auditor_profiles
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for training_records
CREATE POLICY "Users can view training records" ON training_records
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager') OR
    auditor_id = auth.uid()
  );

CREATE POLICY "Auditors can manage own training records" ON training_records
  FOR ALL USING (auditor_id = auth.uid());

CREATE POLICY "Admins and managers can manage training records" ON training_records
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for cpd_records
CREATE POLICY "Users can view CPD records" ON cpd_records
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager') OR
    auditor_id = auth.uid()
  );

CREATE POLICY "Auditors can manage own CPD records" ON cpd_records
  FOR ALL USING (auditor_id = auth.uid());

CREATE POLICY "Admins and managers can manage CPD records" ON cpd_records
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create indexes
CREATE INDEX idx_auditor_profiles_user_id ON auditor_profiles(user_id);
CREATE INDEX idx_auditor_profiles_is_approved ON auditor_profiles(is_approved);
CREATE INDEX idx_training_records_auditor_id ON training_records(auditor_id);
CREATE INDEX idx_cpd_records_auditor_id ON cpd_records(auditor_id);
CREATE INDEX idx_cpd_records_activity_date ON cpd_records(activity_date);

-- Create updated_at triggers
CREATE TRIGGER update_auditor_profiles_updated_at 
    BEFORE UPDATE ON auditor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_records_updated_at 
    BEFORE UPDATE ON training_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cpd_records_updated_at 
    BEFORE UPDATE ON cpd_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
