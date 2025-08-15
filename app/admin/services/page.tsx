"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, DollarSign, Clock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { createService, updateService } from "@/lib/actions"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_hours: number
  is_active: boolean
  created_at: string
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-accent text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>{isEditing ? "Update Service" : "Create Service"}</>
      )}
    </Button>
  )
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [createState, createAction] = useActionState(createService, null)
  const [updateState, updateAction] = useActionState(updateService, null)

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false })

      if (data && !error) {
        setServices(data)
      }
      setLoading(false)
    }

    fetchServices()
  }, [])

  useEffect(() => {
    if (createState?.success || updateState?.success) {
      setShowForm(false)
      setEditingService(null)
      // Refresh services
      fetchServices()
    }
  }, [createState, updateState])

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false })

    if (data) {
      setServices(data)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading services...</p>
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
                <h1 className="text-3xl font-heading font-bold text-foreground">Manage Services</h1>
                <p className="text-muted-foreground">Create and manage your photography services</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-accent text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Form */}
            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    {editingService ? "Edit Service" : "Create New Service"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={editingService ? updateAction : createAction} className="space-y-6">
                    {editingService && <input type="hidden" name="serviceId" value={editingService.id} />}

                    {(createState?.error || updateState?.error) && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
                        {createState?.error || updateState?.error}
                      </div>
                    )}

                    {(createState?.success || updateState?.success) && (
                      <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
                        {createState?.success || updateState?.success}
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Service Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        defaultValue={editingService?.name || ""}
                        placeholder="e.g., Wedding Photography"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Description *
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        defaultValue={editingService?.description || ""}
                        placeholder="Describe what's included in this service..."
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                          Price ($) *
                        </label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          defaultValue={editingService?.price || ""}
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="durationHours" className="block text-sm font-medium text-foreground mb-2">
                          Duration (hours) *
                        </label>
                        <Input
                          id="durationHours"
                          name="durationHours"
                          type="number"
                          min="1"
                          required
                          defaultValue={editingService?.duration_hours || ""}
                          placeholder="2"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {editingService && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          defaultChecked={editingService.is_active}
                          className="rounded border-border"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                          Service is active and available for booking
                        </label>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <SubmitButton isEditing={!!editingService} />
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Services List */}
            <div className={showForm ? "" : "lg:col-span-2"}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Current Services ({services.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-foreground">{service.name}</h3>
                                <Badge variant={service.is_active ? "default" : "secondary"}>
                                  {service.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>${service.price}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{service.duration_hours} hours</span>
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first photography service to get started.
                      </p>
                      <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-accent text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
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
