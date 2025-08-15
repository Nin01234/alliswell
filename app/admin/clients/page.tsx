"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Search, Mail, Phone, Calendar, DollarSign, MessageSquare, Eye, Filter } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface Client {
  user_id: string
  email: string
  full_name: string
  phone: string
  role: string
  created_at: string
  total_bookings: number
  total_spent: number
  last_booking_date: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select(`
          user_id,
          full_name,
          phone,
          role,
          created_at
        `)
        .eq("role", "client")
        .order("created_at", { ascending: false })

      if (profiles && !error) {
        // Get additional client details
        const clientsWithDetails = await Promise.all(
          profiles.map(async (profile) => {
            // Get user email
            const { data: user } = await supabase.auth.admin.getUserById(profile.user_id)

            // Get booking stats
            const { data: bookings } = await supabase
              .from("bookings")
              .select("total_amount, created_at")
              .eq("user_id", profile.user_id)

            const totalBookings = bookings?.length || 0
            const totalSpent = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
            const lastBookingDate = bookings?.[0]?.created_at || null

            return {
              ...profile,
              email: user.user?.email || "",
              total_bookings: totalBookings,
              total_spent: totalSpent,
              last_booking_date: lastBookingDate,
            }
          }),
        )

        setClients(clientsWithDetails)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && client.total_bookings > 0
    if (activeTab === "new") return matchesSearch && client.total_bookings === 0

    return matchesSearch
  })

  const getClientStatus = (client: Client) => {
    if (client.total_bookings === 0) return { label: "New", color: "bg-blue-100 text-blue-800" }
    if (client.total_bookings >= 5) return { label: "VIP", color: "bg-purple-100 text-purple-800" }
    if (client.total_bookings >= 2) return { label: "Regular", color: "bg-green-100 text-green-800" }
    return { label: "Active", color: "bg-yellow-100 text-yellow-800" }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="bg-transparent">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-heading font-bold text-foreground">Client Management</h1>
                <p className="text-muted-foreground">View and manage all your photography clients</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all">All Clients ({clients.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({clients.filter((c) => c.total_bookings > 0).length})</TabsTrigger>
              <TabsTrigger value="new">New ({clients.filter((c) => c.total_bookings === 0).length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse shadow-medium">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredClients.length === 0 ? (
                <Card className="shadow-medium">
                  <CardContent className="p-12 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No clients found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms." : "Clients will appear here once they sign up."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map((client, index) => {
                    const status = getClientStatus(client)
                    return (
                      <Card
                        key={client.user_id}
                        className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="font-heading text-lg text-foreground mb-1">
                                {client.full_name}
                              </CardTitle>
                              <Badge className={status.color}>{status.label}</Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground truncate">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{client.phone || "No phone"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Joined {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">{client.total_bookings}</p>
                              <p className="text-xs text-muted-foreground">Bookings</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">GH₵ {client.total_spent}</p>
                              <p className="text-xs text-muted-foreground">Total Spent</p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Bookings
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
