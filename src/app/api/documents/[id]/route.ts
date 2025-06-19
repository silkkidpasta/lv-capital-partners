import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID
    const idSchema = z.string().uuid()
    const validId = idSchema.safeParse(params.id)
    if (!validId.success) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    // Query document from database
    const { data: document, error: queryError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single()

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If document is still processing, return status without URL
    if (document.status === 'processing') {
      return NextResponse.json({
        documentId: params.id,
        status: document.status
      })
    }

    // Generate signed URL for non-processing documents
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .createSignedUrl(document.file_path, 3600) // 1 hour expiry

    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({
      documentId: params.id,
      status: document.status,
      url: signedUrlData.signedUrl
    })
  } catch (err: any) {
    console.error('Error in documents/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
EOF  
cd /home/project && cd lv-capital-partners && cat > src/app/api/documents/[id]/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID
    const idSchema = z.string().uuid()
    const validId = idSchema.safeParse(params.id)
    if (!validId.success) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
    }

    // Query document from database
    const { data: document, error: queryError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single()

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If document is still processing, return status without URL
    if (document.status === 'processing') {
      return NextResponse.json({
        documentId: params.id,
        status: document.status
      })
    }

    // Generate signed URL for non-processing documents
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .createSignedUrl(document.file_path, 3600) // 1 hour expiry

    if (urlError) {
      console.error('Error generating signed URL:', urlError)
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({
      documentId: params.id,
      status: document.status,
      url: signedUrlData.signedUrl
    })
  } catch (err: any) {
    console.error('Error in documents/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
