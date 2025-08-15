"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Camera, Users, Award, Clock, Sparkles, ArrowRight, Play } from "lucide-react"

const heroTexts = [
  "Capturing Ghana's Most Beautiful Moments",
  "Professional Photography Across Ghana",
  "Your Story, Our Artistry",
  "Preserving Memories That Last Forever",
]

const serviceTexts = [
  "Traditional Weddings & Ceremonies",
  "Modern Photography Services",
  "Tourism & Lifestyle Shoots",
  "Corporate & Event Photography",
]

export default function ClientPortalPage() {
  const [currentHeroText, setCurrentHeroText] = useState(0)
  const [currentServiceText, setCurrentServiceText] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    "/images/wedding-1.jpg",
    "/images/wedding-2.jpg",
    "/images/traditional-1.jpg",
    "/images/wedding-ceremony.jpg",
  ]

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroText((prev) => (prev + 1) % heroTexts.length)
    }, 3000)

    const serviceInterval = setInterval(() => {
      setCurrentServiceText((prev) => (prev + 1) % serviceTexts.length)
    }, 2500)

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)

    return () => {
      clearInterval(heroInterval)
      clearInterval(serviceInterval)
      clearInterval(imageInterval)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Enhanced Hero Section with Text Sliders */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt="Photography showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
            </div>
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-40 left-20 w-24 h-24 bg-primary/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Animated Text Slider */}
            <div className="space-y-6">
              <div className="h-20 flex items-center justify-center">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight text-center">
                  <span className="block gradient-primary bg-clip-text text-transparent animate-slide-up">
                    {heroTexts[currentHeroText]}
                  </span>
                </h1>
              </div>

              <div className="h-16 flex items-center justify-center">
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto animate-fade-in">
                  {serviceTexts[currentServiceText]}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-white px-10 py-5 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-5 text-xl glass-effect transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-sm group"
              >
                <Link href="/auth/login" className="flex items-center gap-3">
                  <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Client Login
                </Link>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/20 px-8 py-5 text-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/portfolio" className="flex items-center gap-3">
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  View Portfolio
                </Link>
              </Button>
            </div>

            {/* Stats with Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {[
                { number: "500+", label: "Happy Clients" },
                { number: "1000+", label: "Events Captured" },
                { number: "5+", label: "Years Experience" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience seamless booking, real-time communication, and professional photography services all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Easy Booking",
                description: "Book your photography session in minutes with our streamlined process.",
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                icon: Users,
                title: "Real-time Communication",
                description: "Chat directly with photographers and get instant updates on your projects.",
                color: "bg-green-500/10 text-green-600",
              },
              {
                icon: Award,
                title: "Professional Quality",
                description: "Access to Ghana's top photographers with guaranteed professional results.",
                color: "bg-purple-500/10 text-purple-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-medium"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-4 text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
              Our Photography Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From traditional ceremonies to modern celebrations, we capture every moment with artistic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Weddings", image: "/images/wedding-1.jpg", price: "From GH₵2,000" },
              { title: "Traditional Ceremonies", image: "/images/traditional-1.jpg", price: "From GH₵1,500" },
              { title: "Portraits", image: "/images/bride-portrait.jpg", price: "From GH₵800" },
              { title: "Events", image: "/images/wedding-ceremony.jpg", price: "From GH₵1,200" },
            ].map((service, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-sm opacity-90">{service.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-accent text-white px-8 py-4">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
