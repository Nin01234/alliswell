"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DeleteBookingButtonProps {
  bookingId: string
}

export default function DeleteBookingButton({ bookingId }: DeleteBookingButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      // Delete related records first (messages, files, etc.)
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("booking_id", bookingId)
      
      if (messagesError) {
        console.warn("Warning: Could not delete messages:", messagesError)
      }

      const { error: filesError } = await supabase
        .from("file_uploads")
        .delete()
        .eq("booking_id", bookingId)
      
      if (filesError) {
        console.warn("Warning: Could not delete files:", filesError)
      }
      
      // Delete the booking
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId)
      
      if (error) {
        throw error
      }

      // Force a hard refresh to ensure the page updates
      window.location.reload()
    } catch (error) {
      console.error("Error deleting booking:", error)
      alert("Failed to delete booking. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="relative">
      {showConfirm ? (
        <div className="absolute right-0 top-0 z-10 bg-white border border-border rounded-lg shadow-lg p-3 w-48">
          <p className="text-sm text-foreground mb-3">Delete this booking?</p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
