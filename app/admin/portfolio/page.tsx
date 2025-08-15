"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Star, ImageIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { addPortfolioImage, updatePortfolioImage, deletePortfolioImage } from "@/lib/actions"

interface PortfolioImage {
  id: string
  title: string
  description: string
  image_url: string
  is_featured: boolean
  sort_order: number
  created_at: string
  portfolio_categories: {
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-accent text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Adding..."}
        </>
      ) : (
        <>{isEditing ? "Update Image" : "Add Image"}</>
      )}
    </Button>
  )
}

export default function AdminPortfolioPage() {
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [addState, addAction] = useActionState(addPortfolioImage, null)
  const [updateState, updateAction] = useActionState(updatePortfolioImage, null)
  const [deleteState, deleteAction] = useActionState(deletePortfolioImage, null)

  useEffect(() => {
    async function fetchData() {
      // Get categories
      const { data: categoriesData } = await supabase
        .from("portfolio_categories")
        .select("*")
        .order("name", { ascending: true })

      setCategories(categoriesData || [])

      // Get portfolio images
      const { data: imagesData } = await supabase
        .from("portfolio_images")
        .select(`
          *,
          portfolio_categories (name, slug)
        `)
        .order("created_at", { ascending: false })

      setImages(imagesData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (addState?.success || updateState?.success || deleteState?.success) {
      setShowForm(false)
      setEditingImage(null)
      setSelectedFile(null)
      // Refresh images
      fetchImages()
    }
  }, [addState, updateState, deleteState])

  const fetchImages = async () => {
    const { data } = await supabase
      .from("portfolio_images")
      .select(`
        *,
        portfolio_categories (name, slug)
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setImages(data)
    }
  }

  const handleEdit = (image: PortfolioImage) => {
    setEditingImage(image)
    setShowForm(true)
  }

  const handleDelete = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      const formData = new FormData()
      formData.append("imageId", imageId)
      await deleteAction(formData)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingImage(null)
    setSelectedFile(null)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    if (!editingImage && selectedFile) {
      formData.append("file", selectedFile)
    }

    if (editingImage) {
      formData.append("imageId", editingImage.id)
      await updateAction(formData)
    } else {
      await addAction(formData)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Manage Portfolio</h1>
                <p className="text-muted-foreground">Add and manage your photography portfolio</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-accent text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Form */}
            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    {editingImage ? "Edit Portfolio Image" : "Add New Portfolio Image"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={handleSubmit} className="space-y-6">
                    {(addState?.error || updateState?.error) && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
                        {addState?.error || updateState?.error}
                      </div>
                    )}

                    {(addState?.success || updateState?.success) && (
                      <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
                        {addState?.success || updateState?.success}
                      </div>
                    )}

                    {!editingImage && (
                      <div>
                        <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
                          Image File *
                        </label>
                        <input
                          id="file"
                          type="file"
                          onChange={handleFileSelect}
                          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          accept="image/*"
                          required={!editingImage}
                        />
                        {selectedFile && (
                          <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFile.name}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">
                        Category *
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        required
                        defaultValue={
                          editingImage?.portfolio_categories
                            ? categories.find((c) => c.name === editingImage.portfolio_categories.name)?.id
                            : ""
                        }
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                        Title *
                      </label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        required
                        defaultValue={editingImage?.title || ""}
                        placeholder="e.g., Sarah & Michael's Wedding"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue={editingImage?.description || ""}
                        placeholder="Optional description of the image..."
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        defaultChecked={editingImage?.is_featured || false}
                        className="rounded border-border"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium text-foreground">
                        Featured image (show prominently on homepage)
                      </label>
                    </div>

                    <div className="flex items-center space-x-4">
                      <SubmitButton isEditing={!!editingImage} />
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Images */}
            <div className={showForm ? "" : "lg:col-span-2"}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Portfolio Images ({images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {deleteState?.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded mb-4">
                      {deleteState.error}
                    </div>
                  )}

                  {deleteState?.success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded mb-4">
                      {deleteState.success}
                    </div>
                  )}

                  {images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-border">
                            <img
                              src={image.image_url || "/placeholder.svg"}
                              alt={image.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                              <Button variant="secondary" size="sm" onClick={() => handleEdit(image)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDelete(image.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-foreground text-sm">{image.title}</h3>
                              {image.is_featured && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{image.portfolio_categories?.name}</p>
                            {image.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{image.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No portfolio images yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first portfolio image to showcase your work.
                      </p>
                      <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-accent text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
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
