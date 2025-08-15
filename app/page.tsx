"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Camera, Heart, Star, Users, Award, Clock, MapPin, Sparkles } from "lucide-react"
import { SocialMediaLinks } from "@/components/social-media-links"

// Dynamic text arrays for the hero section
const heroTitles = [
  "Capturing",
  "Preserving", 
  "Celebrating",
  "Documenting",
  "Showcasing"
]

const heroSubtitles = [
  "Ghana's Beauty",
  "Your Moments",
  "Life's Stories", 
  "Cultural Heritage",
  "Special Memories"
]

const heroDescriptions = [
  "Professional photography services across Ghana. From traditional ceremonies to modern weddings, we capture the essence of your most precious moments.",
  "Every click tells a story. We specialize in capturing the authentic moments that make your celebrations truly unforgettable.",
  "From the vibrant streets of Accra to the serene landscapes of Ghana, we document your journey with artistic excellence.",
  "Honoring Ghanaian traditions while embracing modern photography techniques to create timeless memories.",
  "Your story deserves to be told beautifully. Let us capture the moments that matter most to you and your family."
]

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroTitles.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img
              src="/images/wedding-1.jpg"
              alt="Beautiful wedding photography"
              className="absolute inset-0 w-full h-full object-cover animate-float"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
                  <span className={`block transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                    {heroTitles[currentIndex]}
                  </span>
                  <span className={`block animate-text-shimmer transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                    {heroSubtitles[currentIndex]}
                  </span>
                </h1>
                <p className={`text-xl text-white/90 leading-relaxed max-w-lg transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                  {heroDescriptions[currentIndex]}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/portfolio" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    View My Work
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/80 text-white hover:bg-white hover:text-primary px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Book Session
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Happy Clients</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-white/80 text-sm">Events Captured</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-white">5+</div>
                  <div className="text-white/80 text-sm">Years Experience</div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-6">
                <p className="text-white/80 text-sm mb-3">Follow us on social media</p>
                <SocialMediaLinks variant="hero" className="justify-start" />
              </div>
            </div>

            {/* Image Gallery Preview */}
            <div className="relative lg:block hidden">
              <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <div className="space-y-4">
                  <img
                    src="/images/bride-portrait.jpg"
                    alt="Elegant bride portrait"
                    className="w-full h-64 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src="/images/traditional-1.jpg"
                    alt="Traditional Ghanaian ceremony"
                    className="w-full h-48 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="/images/wedding-4.jpg"
                    alt="Wedding ceremony"
                    className="w-full h-48 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src="/images/traditional-2.jpg"
                    alt="Traditional attire photography"
                    className="w-full h-64 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
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

      {/* Services Overview */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
              Celebrating Ghana's Moments
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From traditional ceremonies to modern celebrations, we specialize in capturing the rich culture and
              beautiful moments that make Ghana special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Traditional Weddings",
                description: "Capturing the beauty of Ghanaian wedding traditions with cultural sensitivity.",
                image: "/images/traditional-3.jpg",
              },
              {
                icon: Users,
                title: "Naming Ceremonies",
                description: "Documenting the joy of welcoming new life into Ghanaian families.",
                image: "/images/wedding-2.jpg",
              },
              {
                icon: Award,
                title: "Graduations",
                description: "Celebrating academic achievements and milestone moments.",
                image: "/images/wedding-3.jpg",
              },
              {
                icon: Camera,
                title: "Tourism Photography",
                description: "Showcasing Ghana's natural beauty and cultural landmarks.",
                image: "/images/wedding-ceremony.jpg",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <service.icon className="absolute top-4 right-4 h-8 w-8 text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-2 text-lg">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground">
                Why Choose Alliswell Shot It?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Based in Accra with deep roots in Ghanaian culture, we bring authenticity and professionalism to every
                shoot.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Local Expertise",
                    description: "Deep understanding of Ghanaian traditions and the best photography locations.",
                  },
                  {
                    icon: Clock,
                    title: "Timely Delivery",
                    description: "Quick turnaround times with sneak peeks within 48 hours.",
                  },
                  {
                    icon: Star,
                    title: "Premium Quality",
                    description: "Professional equipment and post-processing for stunning results.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 border border-primary/20 group-hover:border-primary/40">
                        <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/traditional-1.jpg"
                  alt="Traditional ceremony"
                  className="w-full h-64 object-cover rounded-lg shadow-medium hover:shadow-large transition-shadow duration-300"
                />
                <img
                  src="/images/wedding-4.jpg"
                  alt="Modern wedding"
                  className="w-full h-64 object-cover rounded-lg shadow-medium hover:shadow-large transition-shadow duration-300 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/wedding-ceremony.jpg" alt="Wedding ceremony" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-white animate-slide-up">
            Ready to Capture Your Story?
          </h2>
          <p className="text-xl mb-8 text-white/90 animate-slide-up">
            Let's create beautiful memories together. Book your photography session today and experience the difference
            professional photography makes in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              variant="secondary"
              className="bg-gradient-to-r from-white to-white/95 text-primary hover:from-white/95 hover:to-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/80 text-white hover:bg-white hover:text-primary px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white"
            >
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
