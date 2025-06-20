import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get user ID from Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { size, type } = file;
    if (size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileId = uuidv4(); // Generate a UUID for the file
    const path = `${userId}/${fileId}-${file.name}`; // Construct path using userId and fileId
    const { data: storageData, error: storageError } =
      await supabaseAdmin.storage
        .from('kyc-documents')
        .upload(path, file, { contentType: file.type });

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Insert into documents table
    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .insert([{ id: fileId, user_id: userId, filename: file.name, url: storageData.path, status: 'processing' }]); // Added status

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ documentId: fileId, status: 'processing' });
  } catch (err) {
    console.error('Error in documents/upload:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
