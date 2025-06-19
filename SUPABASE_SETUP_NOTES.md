# Supabase Setup Notes

## Storage Bucket Creation

The Supabase storage bucket 'kyc-documents' needs to be created manually in the Supabase dashboard or via SQL:

```sql
-- Create the storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false);

-- Set up RLS policies for the bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

This bucket creation is not included in the migration files as it's typically done once during initial setup.
EOF  
cd /home/project && cd lv-capital-partners && cat > SUPABASE_SETUP_NOTES.md << 'EOF'
# Supabase Setup Notes

## Storage Bucket Creation

The Supabase storage bucket 'kyc-documents' needs to be created manually in the Supabase dashboard or via SQL:

```sql
-- Create the storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false);

-- Set up RLS policies for the bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

This bucket creation is not included in the migration files as it's typically done once during initial setup.
