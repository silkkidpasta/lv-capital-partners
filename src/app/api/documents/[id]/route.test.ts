import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database
jest.mock('@/lib/database', () => ({
  getDocumentById: jest.fn(),
}));

describe('/api/documents/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return document status', async () => {
    const mockDocument = {
      id: '123',
      status: 'processing',
      name: 'test.pdf',
      createdAt: new Date(),
    };

    const { getDocumentById } = require('@/lib/database');
    getDocumentById.mockResolvedValue(mockDocument);

    const request = new NextRequest('http://localhost:3000/api/documents/123');
    const response = await GET(request, { params: { id: '123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockDocument);
  });

  it('should return 404 for non-existent document', async () => {
    const { getDocumentById } = require('@/lib/database');
    getDocumentById.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/documents/999');
    const response = await GET(request, { params: { id: '999' } });

    expect(response.status).toBe(404);
  });
});
EOF  
cd /home/project && cd lv-capital-partners && cat > src/app/api/documents/[id]/route.test.ts << 'EOF'
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database
jest.mock('@/lib/database', () => ({
  getDocumentById: jest.fn(),
}));

describe('/api/documents/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return document status', async () => {
    const mockDocument = {
      id: '123',
      status: 'processing',
      name: 'test.pdf',
      createdAt: new Date(),
    };

    const { getDocumentById } = require('@/lib/database');
    getDocumentById.mockResolvedValue(mockDocument);

    const request = new NextRequest('http://localhost:3000/api/documents/123');
    const response = await GET(request, { params: { id: '123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockDocument);
  });

  it('should return 404 for non-existent document', async () => {
    const { getDocumentById } = require('@/lib/database');
    getDocumentById.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/documents/999');
    const response = await GET(request, { params: { id: '999' } });

    expect(response.status).toBe(404);
  });
});
