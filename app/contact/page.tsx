"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react"
import { SocialMediaLinks, SocialMediaHandles } from "@/components/social-media-links"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Let's Create Something Beautiful
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to capture your special moments? Get in touch to discuss your photography needs and book your session
            in Ghana.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-foreground">Send Me a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="+233 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                        Service Interested In *
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      >
                        <option value="">Select a service</option>
                        <option value="wedding">Wedding Photography</option>
                        <option value="portrait">Portrait Session</option>
                        <option value="event">Event Photography</option>
                        <option value="engagement">Engagement Session</option>
                        <option value="naming-ceremony">Naming Ceremony</option>
                        <option value="graduation">Graduation Photography</option>
                        <option value="tourism">Tourism & Travel</option>
                        <option value="funeral">Funeral Photography</option>
                        <option value="traditional">Traditional Ceremonies</option>
                        <option value="corporate">Corporate Events</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                      Preferred Date
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Tell me about your vision *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share details about your event, style preferences, location ideas, or any questions you have..."
                      className="w-full"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-accent text-white py-3">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-foreground">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">productions.alliswell@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Phone Numbers</h3>
                      <p className="text-muted-foreground">+233 308 131 617</p>
                      <p className="text-muted-foreground">+233 552 727 570</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground">5 Cassava Street</p>
                      <p className="text-muted-foreground">Ashaley Botwe, Accra</p>
                      <p className="text-muted-foreground">Ghana</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Globe className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Service Areas</h3>
                      <p className="text-muted-foreground">Greater Accra Region</p>
                      <p className="text-muted-foreground">Nationwide Ghana Coverage</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Working Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 9:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground text-sm">Sunday: By appointment only</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-foreground">Find Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8267739058!2d-0.1276!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0x72f7c0c0c0c0c0c0!2sAshaley%20Botwe%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1635959999999!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Alliswell Shot It Location - Ashaley Botwe, Accra, Ghana"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Located in the heart of Ashaley Botwe, easily accessible from all parts of Accra.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-foreground">FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">How far in advance should I book?</h3>
                    <p className="text-muted-foreground text-sm">
                      For weddings and traditional ceremonies, I recommend booking 6-12 months in advance. For other
                      sessions, 2-4 weeks is usually sufficient.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Do you travel within Ghana?</h3>
                    <p className="text-muted-foreground text-sm">
                      Yes! I provide photography services across Ghana. Travel fees may apply for locations outside
                      Greater Accra Region.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">When will I receive my photos?</h3>
                    <p className="text-muted-foreground text-sm">
                      You'll receive a sneak peek within 48 hours, and your full gallery will be ready within 2-3 weeks.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Do you cover traditional Ghanaian ceremonies?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      I specialize in capturing traditional ceremonies including naming ceremonies, outdooring,
                      traditional weddings, and cultural events with deep respect for Ghanaian customs.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-foreground">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Follow us on social media</h3>
                    <SocialMediaLinks variant="default" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Social Media Handles</h3>
                    <SocialMediaHandles />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
