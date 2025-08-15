import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Award, Camera, Heart, Users, MapPin, Clock, Star, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-6xl font-heading font-bold text-foreground leading-tight">
                  Meet the
                  <span className="block gradient-primary bg-clip-text text-transparent">Alliswell Shot It Team</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We are a passionate team of professional photographers based in Accra, Ghana, dedicated to capturing
                  life's most precious moments with artistic excellence and cultural sensitivity.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our journey began with a simple love for storytelling through photography. Today, we specialize in
                  traditional ceremonies, modern weddings, portraits, and events, always striving to preserve the
                  authentic emotions and genuine connections that make each moment special.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-accent text-white px-8 py-4 shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/portfolio" className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    View Our Work
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Book Session
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/traditional-1.jpg"
                  alt="Traditional ceremony photography"
                  className="w-full h-64 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/images/wedding-2.jpg"
                  alt="Wedding photography"
                  className="w-full h-64 object-cover rounded-lg shadow-large hover:scale-105 transition-transform duration-300 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">Our Creative Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the talented photographers who bring your vision to life with passion, creativity, and technical
              excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Raphael",
                role: "Lead Photographer & Creative Director",
                image: "/images/team-raphael.png",
                description:
                  "Specializes in traditional ceremonies and cultural photography with over 6 years of experience.",
                expertise: ["Traditional Weddings", "Cultural Events", "Portrait Photography"],
              },
              {
                name: "Justice",
                role: "Wedding & Event Photographer",
                image: "/images/team-justice.png",
                description:
                  "Expert in modern wedding photography and event coverage with a keen eye for candid moments.",
                expertise: ["Modern Weddings", "Event Photography", "Lifestyle Shoots"],
              },
              {
                name: "Daniel",
                role: "Portrait & Commercial Photographer",
                image: "/images/team-daniel.png",
                description:
                  "Focuses on portrait photography and commercial work with exceptional attention to detail.",
                expertise: ["Corporate Portraits", "Commercial Photography", "Tourism Photography"],
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-foreground mb-1 text-xl">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
              Our Photography Philosophy
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every session is approached with passion, creativity, and a deep commitment to excellence and cultural
              authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Authentic Moments",
                description:
                  "We capture genuine emotions and natural interactions, preserving the true essence of your special moments.",
                color: "bg-red-500/10 text-red-600",
              },
              {
                icon: Camera,
                title: "Technical Excellence",
                description:
                  "Using state-of-the-art equipment and advanced techniques to deliver stunning, professional quality.",
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                icon: Users,
                title: "Personal Connection",
                description:
                  "Building meaningful relationships with clients to understand and capture their unique vision and story.",
                color: "bg-green-500/10 text-green-600",
              },
              {
                icon: Award,
                title: "Cultural Sensitivity",
                description:
                  "Deep respect and understanding of Ghanaian traditions, ensuring authentic representation of cultural moments.",
                color: "bg-purple-500/10 text-purple-600",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="group text-center border-0 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-4 text-lg">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground">Experience & Achievements</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                With years of experience serving clients across Ghana, we've built a reputation for excellence,
                reliability, and artistic vision that captures the heart of every moment.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Ghana-Wide Coverage",
                    description:
                      "Serving clients across all regions of Ghana with local expertise and cultural understanding.",
                  },
                  {
                    icon: Clock,
                    title: "Quick Turnaround",
                    description: "Professional editing and delivery within 48-72 hours for urgent requests.",
                  },
                  {
                    icon: Star,
                    title: "Award-Winning Quality",
                    description: "Recognized for excellence in traditional and modern photography across Ghana.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide-up">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { number: "500+", label: "Happy Clients", description: "Satisfied customers across Ghana" },
                  { number: "1000+", label: "Events Captured", description: "Weddings, ceremonies & celebrations" },
                  { number: "5+", label: "Years Experience", description: "Professional photography expertise" },
                  { number: "24/7", label: "Support Available", description: "Always here when you need us" },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="text-center border-0 shadow-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="text-4xl font-heading font-bold text-primary mb-2">{stat.number}</div>
                      <h3 className="font-heading font-semibold text-foreground mb-1">{stat.label}</h3>
                      <p className="text-muted-foreground text-sm">{stat.description}</p>
                    </CardContent>
                  </Card>
                ))}
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

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-white">
            Ready to Create Beautiful Memories?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Let's capture your story with the artistry and cultural sensitivity it deserves. Book your photography
            session today and experience the Alliswell Shot It difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/portfolio">View Our Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
