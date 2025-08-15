"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Upload, 
  File, 
  Image, 
  Video, 
  Music, 
  Archive, 
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploaded_at: string
  status: "uploading" | "completed" | "error"
  progress?: number
}

const fileTypeIcons: { [key: string]: any } = {
  image: Image,
  video: Video,
  audio: Music,
  archive: Archive,
  text: FileText,
  default: File
}

const fileTypeColors: { [key: string]: string } = {
  image: "bg-green-100 text-green-800",
  video: "bg-blue-100 text-blue-800",
  audio: "bg-purple-100 text-purple-800",
  archive: "bg-orange-100 text-orange-800",
  text: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800"
}

export default function FilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    
    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substr(2, 9)
      const fileType = file.type.split('/')[0] || 'default'
      
      // Add file to list with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: fileType,
        url: '',
        uploaded_at: new Date().toISOString(),
        status: 'uploading',
        progress: 0
      }
      
      setUploadedFiles(prev => [newFile, ...prev])
      
      try {
        // Simulate file upload with progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, progress: i }
                : f
            )
          )
        }
        
        // Mark as completed
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'completed', url: URL.createObjectURL(file) }
              : f
          )
        )
        
      } catch (error) {
        console.error('Upload error:', error)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error' }
              : f
          )
        )
      }
    }
    
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac'],
      'application/zip': ['.zip', '.rar', '.7z'],
      'text/*': ['.txt', '.pdf', '.doc', '.docx']
    },
    multiple: true
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const downloadFile = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:scale-105 transition-transform duration-200"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">File Management</h1>
                <p className="text-muted-foreground">Upload, organize, and manage your photography files</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {uploadedFiles.length} Files
              </Badge>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                  isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-lg font-medium text-primary">Drop files here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Supports images, videos, audio, documents, and archives
                    </p>
                    <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                      Choose Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" />
                  Uploaded Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => {
                    const IconComponent = fileTypeIcons[file.type] || fileTypeIcons.default
                    const statusColor = file.status === 'completed' 
                      ? 'text-green-600' 
                      : file.status === 'error' 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                    
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{file.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <Badge className={fileTypeColors[file.type]}>
                                {file.type.toUpperCase()}
                              </Badge>
                              <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {file.status === 'uploading' && (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-blue-600">{file.progress}%</span>
                            </div>
                          )}
                          
                          {file.status === 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(file)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(file.url, '_blank')}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </>
                          )}
                          
                          {file.status === 'error' && (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Upload Failed
                            </Badge>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {uploadedFiles.length === 0 && !uploading && (
            <Card>
              <CardContent className="p-12 text-center">
                <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No files uploaded yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by uploading your photography files, documents, or any other media
                </p>
                <Button 
                  onClick={() => document.querySelector('[data-dropzone]')?.click()}
                  className="bg-primary hover:bg-accent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
