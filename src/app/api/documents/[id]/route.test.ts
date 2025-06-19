import { GET, documentStatuses } from './route'
import { createRequest } from 'node-mocks-http'

describe('GET /api/documents/[id]', () => {
  test('returns 400 for invalid UUID', async () => {
    const req = createRequest({ method: 'GET', url: '/api/documents/invalid-id' })
    // @ts-ignore
    const res = await GET(req, { params: { id: 'invalid-id' }})
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json).toEqual({ error: 'Invalid document ID' })
  })

  test.each([['processing'], ['verified'], ['failed']])(
    'returns %s status for known documentId',
    async (status) => {
      const id = '123e4567-e89b-12d3-a456-426614174000'
      documentStatuses[id] = status as any

      const req = createRequest({ method: 'GET', url: `/api/documents/${id}` })
      // @ts-ignore
      const res = await GET(req, { params: { id } })
      const json = await res.json()
      expect(res.status).toBe(200)
      expect(json).toEqual({ documentId: id, status })
    }
  )
})
