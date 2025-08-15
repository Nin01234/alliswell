"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Crown,
  Heart,
  Users,
  MapPin,
  Star,
  Gift,
  Camera,
  Baby,
  Briefcase,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { createBooking } from "@/lib/actions"
import { supabase } from "@/lib/supabase/client"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_hours: number
}

const serviceIcons: { [key: string]: any } = {
  "Traditional Wedding Ceremony": Crown,
  "Naming Ceremony Photography": Baby,
  "Graduation Photography": Star,
  "Tourism & Travel Photography": MapPin,
  "Funeral Photography": Users,
  "Engagement & Pre-Wedding": Heart,
  "Corporate Events": Briefcase,
  "Birthday & Celebrations": Gift,
  "Outdooring Ceremony": Baby,
  "Cultural Festivals": Camera,
  "Wedding Photography": Heart,
  "Portrait Sessions": Users,
  "Event Photography": Sparkles,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-accent text-white py-3 transition-all duration-300 hover:scale-105"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Booking...
        </>
      ) : (
        "Book Session"
      )}
    </Button>
  )
}

export default function BookSessionPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [state, formAction] = useActionState(createBooking, null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("name")

      if (data && !error) {
        setServices(data)
      }
    }

    fetchServices()
  }, [])

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8 animate-slide-up">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover:scale-105 transition-transform duration-200 bg-transparent"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground">Book a Session</h1>
              <p className="text-muted-foreground text-lg">Choose your photography service and preferred date</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Choose Your Service
                  </CardTitle>
                  <div className="pt-2">
                    <Input
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredServices.map((service) => {
                    const IconComponent = serviceIcons[service.name] || Camera
                    return (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedService?.id === service.id
                            ? "border-primary bg-primary/10 shadow-medium"
                            : "border-border hover:border-primary/50 hover:shadow-soft"
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-foreground">{service.name}</h3>
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                GH₵ {service.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{service.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{service.duration_hours} hours</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>Starting at GH₵ {service.price}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {filteredServices.length === 0 && (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No services found</h3>
                      <p className="text-muted-foreground">Try adjusting your search terms</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Session Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedService ? (
                    <form action={formAction} className="space-y-6">
                      <input type="hidden" name="serviceId" value={selectedService.id} />

                      {state?.error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded animate-slide-up">
                          {state.error}
                        </div>
                      )}

                      {state?.success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded animate-slide-up">
                          {state.success}
                        </div>
                      )}

                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            {(() => {
                              const IconComponent = serviceIcons[selectedService.name] || Camera
                              return <IconComponent className="h-5 w-5 text-primary" />
                            })()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{selectedService.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{selectedService.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {selectedService.duration_hours} hours coverage
                              </span>
                              <span className="font-semibold text-primary">GH₵ {selectedService.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="bookingDate" className="block text-sm font-medium text-foreground mb-2">
                            Preferred Date *
                          </label>
                          <Input
                            id="bookingDate"
                            name="bookingDate"
                            type="date"
                            min={minDate}
                            required
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="bookingTime" className="block text-sm font-medium text-foreground mb-2">
                            Preferred Time *
                          </label>
                          <Input id="bookingTime" name="bookingTime" type="time" required className="w-full" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                          Event Location
                        </label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g., Accra, Kumasi, Cape Coast..."
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                          Additional Notes
                        </label>
                        <Textarea
                          id="notes"
                          name="notes"
                          rows={4}
                          placeholder="Tell me about your vision, cultural requirements, special requests, or any questions you have..."
                          className="w-full"
                        />
                      </div>

                      <SubmitButton />
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Select a Service</h3>
                      <p className="text-muted-foreground">
                        Choose a photography service to continue with your booking
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Info */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Response Time</p>
                      <p className="text-muted-foreground">Within 24 hours (Ghana Time)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Service Area</p>
                      <p className="text-muted-foreground">Ghana-wide coverage available</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Payment</p>
                      <p className="text-muted-foreground">50% deposit required to secure booking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
