"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sendBookingConfirmationEmail, sendContactFormEmail } from "@/lib/email"

// Update the signIn function to handle redirects properly
export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting directly
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update the signUp function to handle potential null formData
export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function createBooking(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const serviceId = formData.get("serviceId")
  const bookingDate = formData.get("bookingDate")
  const bookingTime = formData.get("bookingTime")
  const notes = formData.get("notes")
  const location = formData.get("location")

  if (!serviceId || !bookingDate || !bookingTime) {
    return { error: "Service, date, and time are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to create a booking" }
    }

    // Get service details for pricing
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("name, price")
      .eq("id", serviceId)
      .single()

    if (serviceError) {
      return { error: "Service not found" }
    }

    // Get user profile for email
    const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        client_id: user.id,
        service_id: serviceId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: notes?.toString() || null,
        location: location?.toString() || null,
        total_amount: service.price,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    if (profile?.email && profile?.full_name) {
      try {
        await sendBookingConfirmationEmail({
          clientName: profile.full_name,
          clientEmail: profile.email,
          serviceName: service.name,
          date: bookingDate.toString(),
          time: bookingTime.toString(),
          location: location?.toString() || "Studio",
          totalAmount: service.price,
          bookingId: booking.id,
        })
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError)
        // Don't fail the booking if email fails
      }
    }

    return { success: "Booking created successfully! We'll be in touch soon." }
  } catch (error) {
    console.error("Booking error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateBookingStatus(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const bookingId = formData.get("bookingId")
  const status = formData.get("status")

  if (!bookingId || !status) {
    return { error: "Booking ID and status are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        status: status.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)

    if (error) {
      return { error: error.message }
    }

    return { success: "Booking status updated successfully" }
  } catch (error) {
    console.error("Update booking error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function createService(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const name = formData.get("name")
  const description = formData.get("description")
  const price = formData.get("price")
  const durationHours = formData.get("durationHours")

  if (!name || !description || !price || !durationHours) {
    return { error: "All fields are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    const { error } = await supabase.from("services").insert({
      name: name.toString(),
      description: description.toString(),
      price: Number.parseFloat(price.toString()),
      duration_hours: Number.parseInt(durationHours.toString()),
      is_active: true,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Service created successfully" }
  } catch (error) {
    console.error("Create service error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateService(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const serviceId = formData.get("serviceId")
  const name = formData.get("name")
  const description = formData.get("description")
  const price = formData.get("price")
  const durationHours = formData.get("durationHours")
  const isActive = formData.get("isActive") === "true"

  if (!serviceId || !name || !description || !price || !durationHours) {
    return { error: "All fields are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    const { error } = await supabase
      .from("services")
      .update({
        name: name.toString(),
        description: description.toString(),
        price: Number.parseFloat(price.toString()),
        duration_hours: Number.parseInt(durationHours.toString()),
        is_active: isActive,
      })
      .eq("id", serviceId)

    if (error) {
      return { error: error.message }
    }

    return { success: "Service updated successfully" }
  } catch (error) {
    console.error("Update service error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function sendMessage(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const bookingId = formData.get("bookingId")
  const content = formData.get("content")

  if (!bookingId || !content) {
    return { error: "Booking ID and message content are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to send messages" }
    }

    // Verify user has access to this booking
    const { data: booking } = await supabase.from("bookings").select("client_id, profiles(full_name)").eq("id", bookingId).single()

    if (!booking) {
      return { error: "Booking not found" }
    }

    // Check if user is the client or an admin
    const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()
    const isAdmin = profile?.role === "admin"
    const isClient = booking.client_id === user.id

    if (!isAdmin && !isClient) {
      return { error: "Access denied. You can only send messages for your own bookings." }
    }

    // Insert message
    const { error: insertError } = await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: user.id,
      content: content.toString().trim(),
      is_read: false,
    })

    if (insertError) {
      return { error: insertError.message }
    }

    // Create notification for the other party
    const recipientId = isAdmin ? booking.client_id : "admin" // For admin notifications, we'll need to handle differently
    if (recipientId && recipientId !== user.id) {
      const notificationTitle = isAdmin ? "New message from client" : "New message from photographer"
      const notificationMessage = `You have a new message about your booking`
      
      await createNotification(
        recipientId,
        notificationTitle,
        notificationMessage,
        "message",
        { booking_id: bookingId, sender_name: profile?.full_name || user.email }
      )
    }

    return { success: "Message sent successfully" }
  } catch (error) {
    console.error("Send message error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function markMessagesAsRead(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const bookingId = formData.get("bookingId")

  if (!bookingId) {
    return { error: "Booking ID is required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Mark all messages in this booking as read (except those sent by current user)
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("booking_id", bookingId)
      .neq("sender_id", user.id)

    if (error) {
      return { error: error.message }
    }

    return { success: "Messages marked as read" }
  } catch (error) {
    console.error("Mark messages as read error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function uploadFile(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const bookingId = formData.get("bookingId")
  const file = formData.get("file") as File
  const fileName = formData.get("fileName")

  if (!bookingId || !file || !fileName) {
    return { error: "Booking ID, file, and file name are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to upload files" }
    }

    // Verify user has access to this booking
    const { data: booking } = await supabase.from("bookings").select("client_id").eq("id", bookingId).single()

    if (!booking) {
      return { error: "Booking not found" }
    }

    // Check if user is the client or an admin
    const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()
    const isAdmin = profile?.role === "admin"
    const isClient = booking.client_id === user.id

    if (!isAdmin && !isClient) {
      return { error: "Access denied. You can only upload files for your own bookings." }
    }

    // Create unique file path
    const fileExt = file.name.split(".").pop()
    const filePath = `${bookingId}/${Date.now()}-${fileName}.${fileExt}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("booking-files").upload(filePath, file)

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("booking-files").getPublicUrl(filePath)

    // Save file record to database
    const { error: dbError } = await supabase.from("file_uploads").insert({
      booking_id: bookingId,
      uploader_id: user.id,
      file_name: fileName.toString(),
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
    })

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("booking-files").remove([filePath])
      return { error: dbError.message }
    }

    // Create notification for the other party
    const recipientId = isAdmin ? booking.client_id : "admin"
    if (recipientId && recipientId !== user.id) {
      const notificationTitle = isAdmin ? "New file uploaded by client" : "New file uploaded by photographer"
      const notificationMessage = `A new file "${fileName}" has been uploaded for your booking`
      
      await createNotification(
        recipientId,
        notificationTitle,
        notificationMessage,
        "upload",
        { booking_id: bookingId, file_name: fileName, sender_name: profile?.full_name || user.email }
      )
    }

    return { success: "File uploaded successfully" }
  } catch (error) {
    console.error("Upload file error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function addPortfolioImage(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const categoryId = formData.get("categoryId")
  const title = formData.get("title")
  const description = formData.get("description")
  const file = formData.get("file") as File
  const isFeatured = formData.get("isFeatured") === "true"

  if (!categoryId || !title || !file) {
    return { error: "Category, title, and image file are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    // Create unique file path
    const fileExt = file.name.split(".").pop()
    const filePath = `portfolio/${Date.now()}-${title.toString().replace(/\s+/g, "-").toLowerCase()}.${fileExt}`

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, file)

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio-images").getPublicUrl(filePath)

    // Save portfolio image record to database
    const { error: dbError } = await supabase.from("portfolio_images").insert({
      category_id: categoryId,
      title: title.toString(),
      description: description?.toString() || null,
      image_url: publicUrl,
      thumbnail_url: publicUrl, // For now, use same URL for thumbnail
      is_featured: isFeatured,
      sort_order: 0,
    })

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("portfolio-images").remove([filePath])
      return { error: dbError.message }
    }

    return { success: "Portfolio image added successfully" }
  } catch (error) {
    console.error("Add portfolio image error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updatePortfolioImage(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const imageId = formData.get("imageId")
  const title = formData.get("title")
  const description = formData.get("description")
  const isFeatured = formData.get("isFeatured") === "true"

  if (!imageId || !title) {
    return { error: "Image ID and title are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    const { error } = await supabase
      .from("portfolio_images")
      .update({
        title: title.toString(),
        description: description?.toString() || null,
        is_featured: isFeatured,
      })
      .eq("id", imageId)

    if (error) {
      return { error: error.message }
    }

    return { success: "Portfolio image updated successfully" }
  } catch (error) {
    console.error("Update portfolio image error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function deletePortfolioImage(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const imageId = formData.get("imageId")

  if (!imageId) {
    return { error: "Image ID is required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    // Get image details before deletion
    const { data: image } = await supabase.from("portfolio_images").select("image_url").eq("id", imageId).single()

    if (!image) {
      return { error: "Image not found" }
    }

    // Delete from database
    const { error: dbError } = await supabase.from("portfolio_images").delete().eq("id", imageId)

    if (dbError) {
      return { error: dbError.message }
    }

    // Extract file path from URL and delete from storage
    try {
      const urlParts = image.image_url.split("/")
      const filePath = urlParts.slice(-2).join("/") // Get last two parts (folder/filename)
      await supabase.storage.from("portfolio-images").remove([filePath])
    } catch (storageError) {
      console.error("Storage cleanup error:", storageError)
      // Don't fail the operation if storage cleanup fails
    }

    return { success: "Portfolio image deleted successfully" }
  } catch (error) {
    console.error("Delete portfolio image error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function sendContactMessage(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const name = formData.get("name")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const message = formData.get("message")

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required" }
  }

  try {
    const emailResult = await sendContactFormEmail({
      name: name.toString(),
      email: email.toString(),
      phone: phone?.toString(),
      message: message.toString(),
    })

    if (!emailResult.success) {
      return { error: "Failed to send message. Please try again." }
    }

    return { success: "Thank you for your message! We'll get back to you within 24 hours." }
  } catch (error) {
    console.error("Contact form error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function processPayment(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const bookingId = formData.get("bookingId")
  const paymentMethodId = formData.get("paymentMethodId")
  const phoneNumber = formData.get("phoneNumber")
  const amount = formData.get("amount")

  if (!bookingId || !paymentMethodId || !amount) {
    return { error: "Booking ID, payment method, and amount are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to process payment" }
    }

    // Verify booking belongs to user
    const { data: booking } = await supabase
      .from("bookings")
      .select("client_id, total_amount")
      .eq("id", bookingId)
      .single()

    if (!booking || booking.client_id !== user.id) {
      return { error: "Booking not found or access denied" }
    }

    // Get payment method details
    const { data: paymentMethod } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", paymentMethodId)
      .single()

    if (!paymentMethod) {
      return { error: "Payment method not found" }
    }

    // Generate payment reference
    const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Calculate fees
    const baseAmount = Number.parseFloat(amount.toString())
    const transactionFee = (baseAmount * paymentMethod.processing_fee_percentage) / 100
    const netAmount = baseAmount - transactionFee

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        payment_method_id: paymentMethodId,
        amount: baseAmount,
        payment_reference: paymentReference,
        payment_method_type: paymentMethod.type,
        payment_provider: paymentMethod.provider,
        phone_number: phoneNumber?.toString(),
        transaction_fee: transactionFee,
        net_amount: netAmount,
        status: "pending",
      })
      .select()
      .single()

    if (paymentError) {
      return { error: paymentError.message }
    }

    // Here you would integrate with actual payment providers
    // For now, we'll simulate a successful payment for demo purposes

    return {
      success: "Payment initiated successfully",
      paymentReference: paymentReference,
      redirectUrl: `/dashboard/payment-status/${payment.id}`,
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function createNotification(userId: string, title: string, message: string, type: string, data: any = {}) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      data,
      is_read: false,
    })

    if (error) {
      console.error("Create notification error:", error)
      return { error: error.message }
    }

    return { success: "Notification created" }
  } catch (error) {
    console.error("Create notification error:", error)
    return { error: "Failed to create notification" }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)

    if (error) {
      return { error: error.message }
    }

    return { success: "Notification marked as read" }
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function markAllNotificationsAsRead() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      return { error: error.message }
    }

    return { success: "All notifications marked as read" }
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
