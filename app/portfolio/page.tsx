"use client"

import Link from "next/link"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight, Heart, Users, Camera, Sparkles, Crown, Baby } from "lucide-react"

const categories = [
  { id: "all", name: "All Work", icon: Camera },
  { id: "weddings", name: "Weddings", icon: Heart },
  { id: "traditional", name: "Traditional", icon: Crown },
  { id: "portraits", name: "Portraits", icon: Users },
  { id: "ceremonies", name: "Ceremonies", icon: Sparkles },
  { id: "events", name: "Events", icon: Baby },
]

const portfolioItems = [
  {
    id: 1,
    category: "weddings",
    title: "Elegant Wedding Reception",
    description: "A beautiful wedding celebration with stunning decorative elements and romantic lighting",
    image: "/images/wedding-1.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 2,
    category: "weddings",
    title: "Romantic Garden Wedding",
    description: "Outdoor wedding ceremony with pink and purple floral arrangements",
    image: "/images/wedding-2.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 3,
    category: "portraits",
    title: "Bridal Portrait Session",
    description: "Elegant bridal portrait showcasing intricate beadwork and natural beauty",
    image: "/images/bride-portrait.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 4,
    category: "weddings",
    title: "Luxury Wedding Ceremony",
    description: "Grand wedding ceremony with crystal chandeliers and white floral decorations",
    image: "/images/wedding-3.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 5,
    category: "weddings",
    title: "Modern Wedding Photography",
    description: "Contemporary wedding photography in a stunning glass venue",
    image: "/images/wedding-4.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 6,
    category: "traditional",
    title: "Traditional Kente Ceremony",
    description: "Beautiful couple in vibrant traditional Ghanaian kente cloth",
    image: "/images/traditional-1.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 7,
    category: "traditional",
    title: "Traditional Wedding Attire",
    description: "Couple in stunning traditional Ghanaian wedding attire with intricate beadwork",
    image: "/images/traditional-2.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 8,
    category: "traditional",
    title: "Cultural Portrait Session",
    description: "Traditional Ghanaian couple in colorful kente cloth in home setting",
    image: "/images/traditional-3.jpg",
    location: "Accra, Ghana",
  },
  {
    id: 9,
    category: "ceremonies",
    title: "Wedding Ceremony Processional",
    description: "Elegant wedding ceremony with dramatic lighting and floral arrangements",
    image: "/images/wedding-ceremony.jpg",
    location: "Accra, Ghana",
  },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const filteredItems =
    activeCategory === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  const openLightbox = (id: number) => {
    setSelectedImage(id)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    const currentIndex = filteredItems.findIndex((item) => item.id === selectedImage)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedImage(filteredItems[newIndex].id)
  }

  const selectedItem = selectedImage ? portfolioItems.find((item) => item.id === selectedImage) : null

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground mb-6 animate-slide-up">
            My Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
            Discover the beauty of Ghana through my lens. From traditional ceremonies to modern celebrations, each image
            captures the essence of life's most precious moments.
          </p>
          <div className="mt-8 flex justify-center animate-slide-up">
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <span>500+ Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>100+ Weddings</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span>Traditional Ceremonies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 animate-slide-up ${
                  activeCategory === category.id
                    ? "bg-primary hover:bg-accent text-white shadow-medium scale-105"
                    : "border-primary text-primary hover:bg-primary hover:text-white hover:scale-105"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-500 hover:scale-105 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openLightbox(item.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No images found</h3>
              <p className="text-muted-foreground">Try selecting a different category to view more work.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors duration-200"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg">
                <h3 className="font-heading font-bold text-2xl mb-2">{selectedItem.title}</h3>
                <p className="text-lg opacity-90 mb-2">{selectedItem.description}</p>
                <div className="flex items-center gap-4 text-sm opacity-75">
                  <span>📍 {selectedItem.location}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedItem.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 animate-slide-up">Love What You See?</h2>
          <p className="text-xl mb-8 opacity-90 animate-slide-up">
            Let's create beautiful memories together. Book your photography session and become part of our portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">Book Your Session</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
