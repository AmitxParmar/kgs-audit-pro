-- Create document_types table
CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  expiry_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('audit_report', 'certificate', 'evidence', 'procedure', 'form', 'photo', 'other')),
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accreditation_standards table
CREATE TABLE accreditation_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accreditation_audits table
CREATE TABLE accreditation_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id UUID NOT NULL REFERENCES accreditation_standards(id),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  scope TEXT,
  lead_assessor_id UUID REFERENCES users(id),
  team_assessors UUID[] DEFAULT '{}',
  assessment_date DATE NOT NULL,
  recommendation VARCHAR(50) CHECK (recommendation IN ('approval', 'conditional_approval', 'denial', 'surveillance_required')),
  next_assessment_date DATE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditation_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditation_audits ENABLE ROW LEVEL SECURITY;

-- Create policies for document_types
CREATE POLICY "All authenticated users can view document types" ON document_types
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can manage document types" ON document_types
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for documents
CREATE POLICY "Users can view documents" ON documents
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM audits a 
      WHERE a.id = documents.audit_id 
      AND (a.lead_auditor_id = auth.uid() OR auth.uid() = ANY(a.team_members))
    )
  );

CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Document owners and admins can manage documents" ON documents
  FOR UPDATE USING (
    uploaded_by = auth.uid() OR
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

CREATE POLICY "Document owners and admins can delete documents" ON documents
  FOR DELETE USING (
    uploaded_by = auth.uid() OR
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for accreditation_standards
CREATE POLICY "All authenticated users can view accreditation standards" ON accreditation_standards
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can manage accreditation standards" ON accreditation_standards
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for accreditation_audits
CREATE POLICY "Users can view accreditation audits" ON accreditation_audits
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    lead_assessor_id = auth.uid() OR
    auth.uid() = ANY(team_assessors)
  );

CREATE POLICY "Admins and lead assessors can manage accreditation audits" ON accreditation_audits
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager') OR
    lead_assessor_id = auth.uid()
  );

-- Create indexes
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_audit_id ON documents(audit_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_expires_at ON documents(expires_at);
CREATE INDEX idx_accreditation_standards_code ON accreditation_standards(code);
CREATE INDEX idx_accreditation_audits_standard_id ON accreditation_audits(standard_id);
CREATE INDEX idx_accreditation_audits_lead_assessor ON accreditation_audits(lead_assessor_id);
CREATE INDEX idx_accreditation_audits_status ON accreditation_audits(status);

-- Create updated_at triggers
CREATE TRIGGER update_document_types_updated_at 
    BEFORE UPDATE ON document_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accreditation_standards_updated_at 
    BEFORE UPDATE ON accreditation_standards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accreditation_audits_updated_at 
    BEFORE UPDATE ON accreditation_audits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
