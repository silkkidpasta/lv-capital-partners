-- Create documents table for KYC document storage
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'verified', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_id for faster queries
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to insert their own documents
CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid()::text = user_id);

-- Policy for authenticated users to select their own documents
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT TO authenticated
    USING (auth.uid()::text = user_id);

-- Policy for authenticated users to update their own documents
CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE TO authenticated
    USING (auth.uid()::text = user_id);
EOF  
cd /home/project && cd lv-capital-partners && cat > supabase/migrations/20250619140000_create_documents_table.sql << 'EOF'
-- Create documents table for KYC document storage
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'verified', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_id for faster queries
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to insert their own documents
CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid()::text = user_id);

-- Policy for authenticated users to select their own documents
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT TO authenticated
    USING (auth.uid()::text = user_id);

-- Policy for authenticated users to update their own documents
CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE TO authenticated
    USING (auth.uid()::text = user_id);
