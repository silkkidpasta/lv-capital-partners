import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { UploadResponseSchema } from '@/lib/schemas/documents'
import { supabaseAdmin } from '@/lib/supabase-server'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const userId = formData.get('userId') as string

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { size, type, name } = file
    
    if (size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    if (!ACCEPTED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Generate unique document ID and file path
    const documentId = uuidv4()
    const fileExtension = name.split('.').pop()
    const filePath = `${userId}/${documentId}.${fileExtension}`

    // Convert file to buffer for upload
    const fileBuffer = await file.arrayBuffer()
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(filePath, fileBuffer, {
        contentType: type,
        duplex: 'half'
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Insert document record in database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        id: documentId,
        user_id: userId,
        filename: name,
        file_path: filePath,
        file_size: size,
        mime_type: type,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file if DB insert fails
      await supabaseAdmin.storage.from('kyc-documents').remove([filePath])
      return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 })
    }

    const response = { documentId, status: 'processing' as const }
    const parsed = UploadResponseSchema.parse(response)
    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('Error in documents/upload:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
EOF  
cd /home/project && cd lv-capital-partners && cat > src/app/api/documents/upload/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { UploadResponseSchema } from '@/lib/schemas/documents'
import { supabaseAdmin } from '@/lib/supabase-server'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const userId = formData.get('userId') as string

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { size, type, name } = file
    
    if (size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    if (!ACCEPTED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Generate unique document ID and file path
    const documentId = uuidv4()
    const fileExtension = name.split('.').pop()
    const filePath = `${userId}/${documentId}.${fileExtension}`

    // Convert file to buffer for upload
    const fileBuffer = await file.arrayBuffer()
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(filePath, fileBuffer, {
        contentType: type,
        duplex: 'half'
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Insert document record in database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        id: documentId,
        user_id: userId,
        filename: name,
        file_path: filePath,
        file_size: size,
        mime_type: type,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file if DB insert fails
      await supabaseAdmin.storage.from('kyc-documents').remove([filePath])
      return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 })
    }

    const response = { documentId, status: 'processing' as const }
    const parsed = UploadResponseSchema.parse(response)
    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('Error in documents/upload:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
