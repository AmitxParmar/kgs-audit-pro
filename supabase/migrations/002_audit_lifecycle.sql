-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  industry VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  audit_type audit_type NOT NULL,
  status audit_status NOT NULL DEFAULT 'planning',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  objectives TEXT,
  lead_auditor_id UUID REFERENCES users(id),
  team_members UUID[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create non_conformities table
CREATE TABLE non_conformities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  clause_reference VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'verified')),
  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformities ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
CREATE POLICY "Users can view clients" ON clients
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    created_by = auth.uid()
  );

CREATE POLICY "Admins and managers can manage clients" ON clients
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager')
  );

-- Create policies for audits
CREATE POLICY "Users can view audits" ON audits
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    lead_auditor_id = auth.uid() OR
    created_by = auth.uid() OR
    auth.uid() = ANY(team_members)
  );

CREATE POLICY "Admins and managers can manage audits" ON audits
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'audit_manager') OR
    lead_auditor_id = auth.uid()
  );

-- Create policies for non-conformities
CREATE POLICY "Users can view NCs" ON non_conformities
  FOR SELECT USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM audits a 
      WHERE a.id = non_conformities.audit_id 
      AND (a.lead_auditor_id = auth.uid() OR auth.uid() = ANY(a.team_members))
    )
  );

CREATE POLICY "Admins and auditors can manage NCs" ON non_conformities
  FOR ALL USING (
    auth.jwt()->>'role' IN ('admin', 'auditor', 'audit_manager') OR
    assigned_to = auth.uid()
  );

-- Create indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_audits_client_id ON audits(client_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_lead_auditor ON audits(lead_auditor_id);
CREATE INDEX idx_nc_audit_id ON non_conformities(audit_id);
CREATE INDEX idx_nc_status ON non_conformities(status);
CREATE INDEX idx_nc_assigned_to ON non_conformities(assigned_to);

-- Create updated_at triggers
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at 
    BEFORE UPDATE ON audits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_non_conformities_updated_at 
    BEFORE UPDATE ON non_conformities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
