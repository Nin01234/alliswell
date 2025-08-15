"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Loader2,
  Calendar,
  Tag
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  category: string
  created_at: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
                <h1 className="text-3xl font-heading font-bold text-foreground">Support Tickets</h1>
                <p className="text-muted-foreground">Get help with your bookings and services</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-accent mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{ticket.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <span>{ticket.category}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/messages/${ticket.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Messages
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No support tickets yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first support ticket to get help with your bookings
                  </p>
                  <Button className="bg-primary hover:bg-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
