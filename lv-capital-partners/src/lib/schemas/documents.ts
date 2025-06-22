import { z } from 'zod'

export const UploadResponseSchema = z.object({
  documentId: z.string().uuid(),
  status: z.literal('processing'),
})

export type UploadResponse = z.infer<typeof UploadResponseSchema>
