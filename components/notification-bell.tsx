"use client"

import { useState } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useNotifications } from "@/hooks/useNotifications"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  data: any
  created_at: string
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    await markAllAsRead()
    setLoading(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "📅"
      case "message":
        return "💬"
      case "upload":
        return "📁"
      case "payment":
        return "💳"
      case "admin":
        return "👨‍💼"
      default:
        return "🔔"
    }
  }

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "booking":
        return `/dashboard`
      case "message":
        return `/dashboard/messages/${notification.data?.booking_id}`
      case "upload":
        return `/dashboard/files/${notification.data?.booking_id}`
      default:
        return "/dashboard"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 px-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse-glow"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-large">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={loading} className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id)
                        }
                        setIsOpen(false)
                      }}
                    >
                      <div
                        className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer border-l-4 ${
                          notification.is_read ? "border-l-transparent" : "border-l-primary bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium text-sm ${
                                notification.is_read ? "text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
