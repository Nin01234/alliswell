"use client"

import { useState, useEffect, useRef } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Send, Loader2, MessageSquare, Calendar, Clock, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { sendMessage, markMessagesAsRead } from "@/lib/actions"

interface Message {
  id: string
  content: string
  created_at: string
  is_read: boolean
  sender_id: string
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
  total_amount: number
  notes: string
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

function SendButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} size="sm" className="bg-primary hover:bg-accent">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  )
}

export default function AdminMessagesPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messageContent, setMessageContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [state, formAction] = useActionState(sendMessage, null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    async function fetchData() {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      if (!user) return

      // Get booking details
      const { data: bookingData } = await supabase
        .from("bookings")
        .select(`
          *,
          services (name, description),
          profiles (full_name, email, phone)
        `)
        .eq("id", bookingId)
        .single()

      setBooking(bookingData)

      // Get messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (full_name, email, role)
        `)
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true })

      setMessages(messagesData || [])
      setLoading(false)

      // Mark messages as read
      const formData = new FormData()
      formData.append("bookingId", bookingId)
      await markMessagesAsRead(null, formData)
    }

    fetchData()
  }, [bookingId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (state?.success) {
      setMessageContent("")
      // Refresh messages
      fetchMessages()
    }
  }, [state])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (full_name, email, role)
      `)
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    formData.append("bookingId", bookingId)
    await formAction(formData)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading messages...</p>
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Booking not found</h3>
              <p className="text-muted-foreground">The booking you're looking for doesn't exist.</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/bookings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Client Messages</h1>
              <p className="text-muted-foreground">Communicate with {booking.profiles?.full_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Details Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{booking.profiles?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{booking.profiles?.email}</p>
                    {booking.profiles?.phone && (
                      <p className="text-sm text-muted-foreground">{booking.profiles.phone}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">{booking.services?.name}</h4>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{booking.booking_time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>${booking.total_amount}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Client Notes</h4>
                      <p className="text-sm text-muted-foreground p-2 bg-muted rounded">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <CardTitle className="font-heading text-lg">
                    Conversation with {booking.profiles?.full_name}
                  </CardTitle>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    <>
                      {messages.map((message) => {
                        const isCurrentUser = message.sender_id === currentUser?.id
                        const isAdmin = message.profiles?.role === "admin"

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} space-x-2`}
                          >
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-accent text-white text-xs">
                                  {message.profiles?.full_name?.charAt(0) || "C"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? "bg-primary text-white"
                                  : "bg-white border border-border text-foreground"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${isCurrentUser ? "text-white/70" : "text-muted-foreground"}`}
                              >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-white text-xs">📷</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
                      <p className="text-muted-foreground">Start the conversation by sending a message below.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  {state?.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                      {state.error}
                    </div>
                  )}

                  <form action={handleSubmit} className="flex space-x-2">
                    <Input
                      name="content"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      required
                    />
                    <SendButton />
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
