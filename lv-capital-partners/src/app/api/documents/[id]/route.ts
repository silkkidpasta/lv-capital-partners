import { NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory stub for document status tracking
const documentStatuses: Record<string, 'processing' | 'verified' | 'failed'> = {}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate ID
  const idSchema = z.string().uuid()
  const validId = idSchema.safeParse(params.id)
  if (!validId.success) {
    return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 })
  }

  // Retrieve or default to 'processing'
  const status = documentStatuses[params.id] || 'processing'

  return NextResponse.json(
    { documentId: params.id, status },
    { status: 200 }
  )
}

// Export store for manual updates in development/testing
export { documentStatuses }
