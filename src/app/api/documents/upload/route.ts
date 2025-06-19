import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { UploadResponseSchema } from '@/lib/schemas/documents'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const { size, type } = file
    if (size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }
    if (!ACCEPTED_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Stubbed storage logic: in a real implementation, upload to storage backend
    const documentId = uuidv4()
    const response = { documentId, status: 'processing' as const }
    const parsed = UploadResponseSchema.parse(response)

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('Error in documents/upload:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
