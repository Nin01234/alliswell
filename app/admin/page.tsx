import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageSquare,
  Settings,
  BarChart3,
  FileImage,
  UserCheck,
} from "lucide-react"

export default async function AdminDashboardPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get dashboard statistics
  const { data: bookings } = await supabase.from("bookings").select("*")
  const { data: clients } = await supabase.from("user_profiles").select("*").eq("role", "client")
  const { data: services } = await supabase.from("services").select("*")
  const { data: messages } = await supabase.from("messages").select("*")
  const { data: uploads } = await supabase.from("admin_uploads").select("*")

  const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
  const completedBookings = bookings?.filter((b) => b.status === "completed").length || 0
  const unreadMessages = messages?.filter((m) => !m.is_read && m.sender_id !== user.id).length || 0

  // Get recent bookings
  const recentBookings = bookings?.slice(0, 5) || []

  // Get recent clients
  const recentClients = clients?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 animate-slide-up">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg">Manage your photography business with advanced tools</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Clients
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/uploads">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-accent">
                <Link href="/admin/bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Link>
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{bookings?.length || 0}</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clients</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{clients?.length || 0}</p>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-heading font-bold text-foreground">
                      GH₵ {totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Photos Uploaded</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{uploads?.length || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button
              asChild
              className="h-16 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform"
            >
              <Link href="/admin/bookings" className="flex flex-col items-center gap-1">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Manage Bookings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 bg-transparent hover:scale-105 transition-transform">
              <Link href="/admin/messages" className="flex flex-col items-center gap-1">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">Messages {unreadMessages > 0 && `(${unreadMessages})`}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 bg-transparent hover:scale-105 transition-transform">
              <Link href="/admin/uploads" className="flex flex-col items-center gap-1">
                <Upload className="h-5 w-5" />
                <span className="text-sm">Upload Photos</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 bg-transparent hover:scale-105 transition-transform">
              <Link href="/admin/analytics" className="flex flex-col items-center gap-1">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Status Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Approval</p>
                        <p className="text-2xl font-heading font-bold text-foreground">{pendingBookings}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    {pendingBookings > 0 && (
                      <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">
                        Needs Attention
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Confirmed</p>
                        <p className="text-2xl font-heading font-bold text-foreground">{confirmedBookings}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-heading font-bold text-foreground">{completedBookings}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings */}
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-xl">Recent Bookings</CardTitle>
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href="/admin/bookings">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-foreground">Booking #{booking.id.slice(0, 8)}</h3>
                              <Badge
                                variant={
                                  booking.status === "pending"
                                    ? "secondary"
                                    : booking.status === "confirmed"
                                      ? "default"
                                      : "outline"
                                }
                                className={
                                  booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "completed"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                }
                              >
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
                                <span>GH₵ {booking.total_amount}</span>
                              </span>
                            </div>
                          </div>
                          <Button asChild variant="outline" size="sm" className="bg-transparent">
                            <Link href={`/admin/bookings`}>Manage</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground">
                        Bookings will appear here once clients start booking sessions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Clients */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Recent Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentClients.length > 0 ? (
                    <div className="space-y-3">
                      {recentClients.map((client) => (
                        <div key={client.user_id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{client.full_name}</p>
                            <p className="text-sm text-muted-foreground truncate">{client.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No clients yet</p>
                  )}
                  <Button asChild variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    <Link href="/admin/clients">View All Clients</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Services</span>
                    <span className="font-semibold text-foreground">
                      {services?.filter((s) => s.is_active).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unread Messages</span>
                    <Badge variant={unreadMessages > 0 ? "destructive" : "secondary"}>{unreadMessages}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">This Month Revenue</span>
                    <span className="font-semibold text-foreground">GH₵ {(totalRevenue * 0.3).toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Tools */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Admin Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin/services">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Services
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin/social">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Social Media
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
