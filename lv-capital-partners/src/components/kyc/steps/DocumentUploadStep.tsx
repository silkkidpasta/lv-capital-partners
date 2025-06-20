import { useState, useCallback, useEffect } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

type FileObj = {
  file: File
  preview: string
  errors: string[]
  uploading: boolean
  progress: number
}

interface DocumentUploadStepProps {
  onUploadSuccess: (documentId: string) => void
  uploadedDocuments: string[]
}

interface DocumentStatus {
  documentId: string
  status: 'processing' | 'verified' | 'failed'
}

function DocumentUploadStep({ onUploadSuccess, uploadedDocuments }: DocumentUploadStepProps) {
  const [files, setFiles] = useState<FileObj[]>([])
  const [docId, setDocId] = useState<string | null>(null)

  const stableOnUploadSuccess = useCallback(onUploadSuccess, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const mappedAccepted: FileObj[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        errors: [],
        uploading: false,
        progress: 0,
      }))
      const mappedRejected: FileObj[] = fileRejections.map(({ file, errors }) => ({
        file: file as File,
        preview: URL.createObjectURL(file as File),
        errors: errors.map((e) => e.message),
        uploading: false,
        progress: 0,
      }))
      setFiles((curr) => [...curr, ...mappedAccepted, ...mappedRejected])
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  })

  const uploadAll = async () => {
    const updated = [...files]
    for (let i = 0; i < updated.length; i++) {
      const fileObj = updated[i]
      if (fileObj.errors.length === 0 && !fileObj.uploading) {
        fileObj.uploading = true
        setFiles([...updated])
        try {
          const formData = new FormData()
          formData.append('file', fileObj.file)
          const res = await fetch('/api/documents/upload', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) throw new Error('Upload failed')
          const data = await res.json()
          toast.success(`Uploaded ${fileObj.file.name}`)
          handleLocalUploadSuccess(data.id)
        } catch (err) {
          console.error('Upload error:', err)
          toast.error(`Error uploading ${fileObj.file.name}`)
        } finally {
          fileObj.uploading = false
          setFiles([...updated])
        }
      }
    }
  }

  // Revoke data URIs on unmount
  useEffect(() => {
    return () => {
      for (const f of files) {
        URL.revokeObjectURL(f.preview)
      }
    }
  }, [files])

  // After upload, set docId to start polling
  const handleLocalUploadSuccess = (id: string) => {
    setDocId(id)
  }

  // React Query to poll status
  const statusQuery = useQuery<DocumentStatus>({
    queryKey: ['docStatus', docId],
    queryFn: () => fetch(`/api/documents/${docId}`).then((res) => res.json()),
    enabled: Boolean(docId),
    refetchInterval: 2000,
  })

  // Handle status changes
  useEffect(() => {
    if (statusQuery.data?.status && statusQuery.data.status !== 'processing') {
      // notify user
      if (statusQuery.data.status === 'verified') {
        toast.success('Document verified')
        if (docId) {
          stableOnUploadSuccess(docId)
        }
      } else {
        toast.error('Document processing failed')
      }
    }
  }, [statusQuery.data?.status, docId, stableOnUploadSuccess])

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-old-money-charcoal/70 p-8 text-center rounded cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag & drop files here, or click to select (PDF, JPG, PNG, ≤10MB)</p>
        )}
      </div>

      <div className="space-y-2">
        {files.map((f, i) => (
          <div key={`${f.file.name}-${f.file.size}-${i}`} className="flex items-center space-x-4">
            {f.file.type === 'application/pdf' ? (
              <Badge variant="outline">PDF</Badge>
            ) : (
              <img
                src={f.preview}
                className="h-12 w-12 object-cover rounded"
                alt={f.file.name}
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-old-money-navy">{f.file.name}</p>
              {f.errors.map((e, j) => (
                <p key={`error-${j}-${e.slice(0, 10)}`} className="text-sm text-destructive">{e}</p>
              ))}
              {f.uploading && <Progress value={f.progress} />}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={uploadAll} disabled={files.every((f) => f.errors.length > 0)}>
        Upload All
      </Button>

      {docId && (
        <div className="mt-4">
          <span
            className={
              statusQuery.data?.status === 'verified'
                ? 'text-green-600'
                : statusQuery.data?.status === 'failed'
                ? 'text-red-600'
                : 'text-yellow-600'
            }
          >
            {statusQuery.data?.status === 'processing'
              ? 'Processing…'
              : statusQuery.data?.status === 'verified'
              ? 'Verified'
              : 'Failed'}
          </span>
        </div>
      )}
    </div>
  )
}

export default DocumentUploadStep
