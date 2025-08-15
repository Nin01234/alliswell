"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, DollarSign, Search, Filter, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { updateBookingStatus } from "@/lib/actions"

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  status: string
  total_amount: number
  notes: string
  created_at: string
  services: {
    name: string
    description: string
  }
  profiles: {
    full_name: string
    email: string
    phone: string
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [state, formAction] = useActionState(updateBookingStatus, null)

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          services (
            name,
            description
          ),
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false })

      if (data && !error) {
        setBookings(data)
        setFilteredBookings(data)
      }
      setLoading(false)
    }

    async function fetchUnreadCounts() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: unreadMessages } = await supabase
          .from("messages")
          .select("booking_id")
          .eq("is_read", false)
          .neq("sender_id", user.id)

        const counts = unreadMessages?.reduce(
          (acc, msg) => {
            acc[msg.booking_id] = (acc[msg.booking_id] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        setUnreadCounts(counts || {})
      }
    }

    fetchBookings()
    fetchUnreadCounts()
  }, [])

  useEffect(() => {
    let filtered = bookings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const formData = new FormData()
    formData.append("bookingId", bookingId)
    formData.append("status", newStatus)

    await formAction(formData)

    // Refresh bookings
    const { data } = await supabase
      .from("bookings")
      .select(`
        *,
        services (
          name,
          description
        ),
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setBookings(data)
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
              <p className="mt-4 text-muted-foreground">Loading bookings...</p>
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
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Manage Bookings</h1>
              <p className="text-muted-foreground">View and manage all client bookings</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by client name, email, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success/Error Messages */}
          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded mb-6">
              {state.success}
            </div>
          )}
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded mb-6">
              {state.error}
            </div>
          )}

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Bookings ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="p-6 border border-border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {booking.profiles?.full_name || "Unknown Client"}
                            </h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {booking.profiles?.email} • {booking.profiles?.phone}
                          </p>
                          <p className="font-medium text-foreground mb-2">{booking.services?.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{booking.booking_time}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${booking.total_amount}</span>
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Booked on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/messages/${booking.id}`}>
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Messages
                              {unreadCounts[booking.id] && (
                                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                  {unreadCounts[booking.id]}
                                </span>
                              )}
                            </Link>
                          </Button>
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking.id, "completed")}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Bookings will appear here once clients start booking sessions"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
