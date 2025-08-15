import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Check, Camera, Heart, Users, Sparkles, Crown, Baby, Briefcase, MapPin, Star, Gift } from "lucide-react"

const services = [
  {
    icon: Heart,
    title: "Traditional Wedding Photography",
    price: "Starting at GH₵ 3,500",
    duration: "10 hours coverage",
    description: "Complete traditional Ghanaian wedding coverage including kente ceremonies and cultural rituals.",
    features: [
      "Pre-wedding consultation",
      "10 hours of coverage",
      "800+ edited photos",
      "Traditional ceremony documentation",
      "Online gallery with print release",
      "Cultural sensitivity and respect",
    ],
    category: "weddings",
    popular: true,
  },
  {
    icon: Crown,
    title: "Naming Ceremony Photography",
    price: "Starting at GH₵ 800",
    duration: "4 hours coverage",
    description:
      "Traditional Ghanaian naming ceremony documentation with cultural sensitivity and beautiful family moments.",
    features: [
      "Cultural ceremony documentation",
      "4 hours of coverage",
      "150+ edited photos",
      "Family group portraits",
      "Online gallery",
      "Traditional elements capture",
    ],
    category: "traditional",
  },
  {
    icon: Star,
    title: "Graduation Photography",
    price: "Starting at GH₵ 600",
    duration: "3 hours session",
    description: "Academic milestone celebrations including individual portraits and family group photos.",
    features: [
      "Individual graduate portraits",
      "3 hours of coverage",
      "100+ edited photos",
      "Family celebration moments",
      "Campus location options",
      "Quick turnaround delivery",
    ],
    category: "milestones",
  },
  {
    icon: MapPin,
    title: "Tourism & Travel Photography",
    price: "Starting at GH₵ 1,200",
    duration: "6 hours coverage",
    description: "Showcase Ghana's natural beauty and cultural landmarks with professional travel photography.",
    features: [
      "Location scouting included",
      "6 hours of coverage",
      "200+ edited photos",
      "Cultural landmarks focus",
      "Natural beauty capture",
      "Travel portfolio creation",
    ],
    category: "tourism",
  },
  {
    icon: Users,
    title: "Funeral Photography",
    price: "Starting at GH₵ 900",
    duration: "5 hours coverage",
    description: "Respectful documentation of memorial services and celebration of life ceremonies.",
    features: [
      "Respectful documentation",
      "5 hours of coverage",
      "Celebration of life focus",
      "Family gathering moments",
      "Memorial service coverage",
      "Sensitive approach guaranteed",
    ],
    category: "memorial",
  },
  {
    icon: Sparkles,
    title: "Engagement & Pre-Wedding",
    price: "Starting at GH₵ 750",
    duration: "3 hours session",
    description: "Romantic engagement sessions and pre-wedding photography in beautiful Ghanaian locations.",
    features: [
      "Location consultation",
      "3 hours of shooting",
      "80+ edited photos",
      "Save-the-date templates",
      "Beautiful Ghana locations",
      "Wedding package discount",
    ],
    category: "weddings",
  },
  {
    icon: Briefcase,
    title: "Corporate Events",
    price: "Starting at GH₵ 1,000",
    duration: "4 hours coverage",
    description: "Professional corporate event photography for businesses and organizations.",
    features: [
      "Professional documentation",
      "4 hours of coverage",
      "Same-day preview photos",
      "High-resolution gallery",
      "Corporate branding focus",
      "Quick delivery timeline",
    ],
    category: "corporate",
  },
  {
    icon: Gift,
    title: "Birthday & Celebrations",
    price: "Starting at GH₵ 650",
    duration: "4 hours coverage",
    description: "Special birthday celebrations and milestone parties with vibrant photography.",
    features: [
      "Party atmosphere capture",
      "4 hours of coverage",
      "120+ edited photos",
      "Candid moments focus",
      "Group photo coordination",
      "Celebration highlights",
    ],
    category: "celebrations",
  },
  {
    icon: Baby,
    title: "Outdooring Ceremony",
    price: "Starting at GH₵ 700",
    duration: "4 hours coverage",
    description: "Traditional Ghanaian outdooring ceremonies celebrating new life with family and community.",
    features: [
      "Traditional ceremony focus",
      "4 hours of coverage",
      "Family gathering moments",
      "Cultural elements capture",
      "Baby and family portraits",
      "Community celebration",
    ],
    category: "traditional",
  },
  {
    icon: Camera,
    title: "Cultural Festivals",
    price: "Starting at GH₵ 1,500",
    duration: "8 hours coverage",
    description: "Documentation of Ghana's rich cultural festivals and traditional celebrations.",
    features: [
      "Festival documentation",
      "8 hours of coverage",
      "300+ edited photos",
      "Cultural performances",
      "Traditional attire focus",
      "Community celebration",
    ],
    category: "cultural",
  },
]

const categories = [
  { id: "all", name: "All Services", count: services.length },
  { id: "weddings", name: "Weddings", count: services.filter((s) => s.category === "weddings").length },
  { id: "traditional", name: "Traditional", count: services.filter((s) => s.category === "traditional").length },
  { id: "milestones", name: "Milestones", count: services.filter((s) => s.category === "milestones").length },
  { id: "corporate", name: "Corporate", count: services.filter((s) => s.category === "corporate").length },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground mb-6 animate-slide-up">
            Photography Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
            Professional photography services celebrating Ghana's rich culture and beautiful moments. From traditional
            ceremonies to modern celebrations, we capture every precious memory.
          </p>
          <div className="mt-8 flex justify-center animate-slide-up">
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span>Traditional Ceremonies</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>Modern Weddings</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ghana-wide Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`relative border-2 hover:border-primary transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105 animate-slide-up ${
                  service.popular ? "border-primary bg-primary/5" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl text-foreground">{service.title}</CardTitle>
                  <div className="space-y-1">
                    <p className="text-2xl font-heading font-bold text-primary">{service.price}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-center leading-relaxed">{service.description}</p>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-primary hover:bg-accent text-white transition-all duration-300 hover:scale-105">
                    <Link href="/dashboard/book">Book This Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">My Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial consultation to final delivery, here's what you can expect when working with me in Ghana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description:
                  "We discuss your vision, cultural requirements, and preferences to plan the perfect session.",
                icon: Users,
              },
              {
                step: "02",
                title: "Planning",
                description:
                  "Location scouting across Ghana, timeline creation, and cultural preparation for your event.",
                icon: MapPin,
              },
              {
                step: "03",
                title: "Photography",
                description:
                  "Professional photography session capturing your special moments with cultural sensitivity.",
                icon: Camera,
              },
              {
                step: "04",
                title: "Delivery",
                description: "Carefully edited photos delivered through a beautiful online gallery within 2-3 weeks.",
                icon: Gift,
              },
            ].map((process, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-lg mx-auto mb-6">
                    {process.step}
                  </div>
                  <process.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-foreground mb-3 text-lg">{process.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-6 animate-slide-up">Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground mb-12 animate-slide-up">
            All prices are in Ghana Cedis (GH₵) and include professional editing and online gallery delivery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
            <Card className="border-2 border-primary/20 shadow-medium">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading font-bold text-lg mb-2">Travel Within Accra</h3>
                <p className="text-muted-foreground">No additional charges for locations within Greater Accra Region</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-medium">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading font-bold text-lg mb-2">Outside Accra</h3>
                <p className="text-muted-foreground">Travel fees apply for locations outside Greater Accra Region</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-medium">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading font-bold text-lg mb-2">Rush Delivery</h3>
                <p className="text-muted-foreground">48-hour delivery available for additional 25% fee</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 animate-slide-up">
            Ready to Book Your Session?
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-slide-up">
            Let's discuss your photography needs and create beautiful memories together in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/dashboard/book">Book Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/contact">Ask Questions</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
