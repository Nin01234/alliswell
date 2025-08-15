"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Upload, Download, FileText, Image, Video, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { uploadFile } from "@/lib/actions"

interface FileUpload {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  created_at: string
  profiles: {
    full_name: string
    email: string
    role: string
  }
}

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  status: string
  services: {
    name: string
  }
}

function UploadButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-accent">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </>
      )}
    </Button>
  )
}

export default function FilesPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const [files, setFiles] = useState<FileUpload[]>([])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [state, formAction] = useActionState(uploadFile, null)

  useEffect(() => {
    async function fetchData() {
      // Get booking details
      const { data: bookingData } = await supabase
        .from("bookings")
        .select(`
          *,
          services (name)
        `)
        .eq("id", bookingId)
        .single()

      setBooking(bookingData)

      // Get files
      const { data: filesData } = await supabase
        .from("file_uploads")
        .select(`
          *,
          profiles (full_name, email, role)
        `)
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false })

      setFiles(filesData || [])
      setLoading(false)
    }

    fetchData()
  }, [bookingId])

  useEffect(() => {
    if (state?.success) {
      setSelectedFile(null)
      setFileName("")
      // Refresh files
      fetchFiles()
    }
  }, [state])

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("file_uploads")
      .select(`
        *,
        profiles (full_name, email, role)
      `)
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false })

    if (data) {
      setFiles(data)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name.split(".")[0]) // Remove extension for default name
    }
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedFile) {
      formData.append("bookingId", bookingId)
      formData.append("file", selectedFile)
      await formAction(formData)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-5 w-5" />
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading files...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Booking not found</h3>
              <p className="text-muted-foreground">
                The booking you're looking for doesn't exist or you don't have access to it.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Files & Documents</h1>
              <p className="text-muted-foreground">
                {booking.services?.name} • {new Date(booking.booking_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Upload Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={handleSubmit} className="space-y-4">
                    {state?.error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-3 py-2 rounded text-sm">
                        {state.error}
                      </div>
                    )}

                    {state?.success && (
                      <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-3 py-2 rounded text-sm">
                        {state.success}
                      </div>
                    )}

                    <div>
                      <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
                        Select File
                      </label>
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      />
                      {selectedFile && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="fileName" className="block text-sm font-medium text-foreground mb-2">
                        File Name
                      </label>
                      <Input
                        id="fileName"
                        name="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter a descriptive name"
                        required
                      />
                    </div>

                    <UploadButton />
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Files List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Uploaded Files ({files.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {files.length > 0 ? (
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-primary">{getFileIcon(file.file_type)}</div>
                            <div>
                              <h3 className="font-medium text-foreground">{file.file_name}</h3>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>
                                  {file.profiles?.role === "admin" ? "📷 Photographer" : file.profiles?.full_name}
                                </span>
                                <span>•</span>
                                <span>{formatFileSize(file.file_size)}</span>
                                <span>•</span>
                                <span>{new Date(file.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No files uploaded yet</h3>
                      <p className="text-muted-foreground">
                        Upload photos, documents, or other files to share with your photographer.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
