import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, DollarSign, MessageSquare, LogOut, Trash2 } from "lucide-react"
import { signOut } from "@/lib/actions"
import { SupabaseClient } from "@supabase/supabase-js"
import DeleteBookingButton from "./components/DeleteBookingButton"

export default async function DashboardPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = await createClient()
  
  // Type guard to ensure we have a real Supabase client
  if (!('from' in supabase)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Supabase client not available</h1>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user bookings with service details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        name,
        description
      )
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  const { data: unreadCounts } = await supabase
    .from("messages")
    .select("booking_id")
    .eq("is_read", false)
    .neq("sender_id", user.id)

  const unreadMessagesByBooking = unreadCounts?.reduce(
    (acc: Record<string, number>, msg: { booking_id: string }) => {
      acc[msg.booking_id] = (acc[msg.booking_id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Welcome back, {profile?.full_name || user.email}
              </h1>
              <p className="text-muted-foreground">Manage your photography sessions and bookings</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Button asChild className="bg-primary hover:bg-accent">
                <Link href="/dashboard/book">Book New Session</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-heading font-bold text-foreground">{bookings?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {bookings?.filter((b: any) => b.status === "pending").length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      ${bookings?.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0).toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Unread Messages</p>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {Object.values(unreadMessagesByBooking || {}).reduce((sum: number, count: number) => sum + count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{booking.services?.name}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
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
                        {booking.notes && <p className="text-sm text-muted-foreground mt-2">{booking.notes}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/files/${booking.id}`}>Files</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="relative bg-transparent">
                          <Link href={`/dashboard/messages/${booking.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Messages
                            {unreadMessagesByBooking?.[booking.id] && (
                              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                                {unreadMessagesByBooking[booking.id]}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                        <DeleteBookingButton bookingId={booking.id} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No bookings yet</p>
                  <Button asChild className="bg-primary hover:bg-accent">
                    <Link href="/dashboard/book">Book Your First Session</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
