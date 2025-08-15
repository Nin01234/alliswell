import { Resend } from "resend"

// Initialize Resend with API key or use a fallback
const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key")

interface BookingEmailData {
  clientEmail: string
  clientName: string
  serviceName: string
  date: string
  time: string
  location: string
  totalAmount: number
  bookingId: string
}

interface ContactEmailData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Alliswell Shot It Photography <noreply@alliswellshotit.com>",
      to: [data.clientEmail],
      subject: "Booking Confirmation - Alliswell Shot It Photography",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #581c87, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #581c87; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #581c87; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; }
            .contact-info { background: #581c87; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
              <p>Thank you for choosing Alliswell Shot It Photography</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.clientName},</p>
              
              <p>We're excited to confirm your photography booking! Here are your booking details:</p>
              
              <div class="booking-details">
                <h3 style="color: #581c87; margin-top: 0;">Booking Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>${data.bookingId}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span>${data.serviceName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span>${new Date(data.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span>${data.time}</span>
                </div>
                
                ${
                  data.location
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${data.location}</span>
                </div>
                `
                    : ""
                }
                
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span>GH₵${data.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div class="contact-info">
                <h3 style="margin-top: 0;">Contact Information</h3>
                <p><strong>Phone:</strong> +233 30 813 1617 | +233 55 272 7570</p>
                <p><strong>Email:</strong> productions.alliswell@gmail.com</p>
                <p><strong>Address:</strong> 5 Cassava Street, Ashaley Botwe, Accra, Ghana</p>
                <p><strong>Instagram:</strong> @alliswellshotit</p>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>We'll contact you 24-48 hours before your session to confirm details</li>
                <li>Please arrive 15 minutes early to your session</li>
                <li>Bring any props or outfits you'd like to include</li>
                <li>Your edited photos will be ready within 7-14 business days</li>
              </ul>
              
              <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
              
              <p>We look forward to capturing your special moments!</p>
              
              <p>Best regards,<br>
              <strong>The Alliswell Shot It Photography Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Alliswell Shot It Photography. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: emailData }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendContactFormEmail(data: ContactEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Alliswell Shot It Photography <noreply@alliswellshotit.com>",
      to: [process.env.ADMIN_EMAIL || "productions.alliswell@gmail.com"],
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #581c87, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .contact-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #581c87; }
            .message-content { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>Someone has reached out through your website</p>
            </div>
            
            <div class="content">
              <div class="contact-details">
                <h3 style="color: #581c87; margin-top: 0;">Contact Information</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
                <p><strong>Submitted:</strong> ${new Date().toLocaleString("en-GB")}</p>
              </div>
              
              <div class="message-content">
                <h3 style="color: #581c87; margin-top: 0;">Message</h3>
                <p style="white-space: pre-line;">${data.message}</p>
              </div>
              
              <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours for the best customer experience.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Contact email sending error:", error)
      return { success: false, error: error.message }
    }

    // Send confirmation email to the person who submitted the form
    await resend.emails.send({
      from: "Alliswell Shot It Photography <noreply@alliswellshotit.com>",
      to: [data.email],
      subject: "Thank you for contacting Alliswell Shot It Photography",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #581c87, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
              <p>We've received your message</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.name},</p>
              
              <p>Thank you for reaching out to Alliswell Shot It Photography! We've received your message and will get back to you within 24 hours.</p>
              
              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Check out our portfolio on Instagram @alliswellshotit</li>
                <li>Browse our services on our website</li>
                <li>Call us directly at +233 30 813 1617 or +233 55 272 7570</li>
              </ul>
              
              <p>We look forward to discussing how we can capture your special moments!</p>
              
              <p>Best regards,<br>
              <strong>The Alliswell Shot It Photography Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, data: emailData }
  } catch (error) {
    console.error("Contact email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}
