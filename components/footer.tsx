"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Camera, Mail, Phone, MapPin } from "lucide-react"
import { SocialMediaLinks, SocialMediaHandles } from "./social-media-links"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative">
                <Camera className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all duration-300">Alliswell Shot It</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Capturing Ghana's most precious moments with artistry and cultural sensitivity. Professional photography
              services for traditional ceremonies, modern weddings, and life's beautiful celebrations.
            </p>

            {/* Social Media Links */}
            <div className="mb-6">
              <h4 className="font-heading font-medium text-foreground mb-3 text-sm">Follow Us</h4>
              <SocialMediaLinks variant="default" />
            </div>

            {/* Quick Contact */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+233 308 131 617</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+233 552 727 570</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
                { href: "/dashboard/book", label: "Book Session" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Contact & Location</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">productions.alliswell@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">5 Cassava Street</p>
                  <p className="text-sm">Ashaley Botwe, Accra</p>
                  <p className="text-sm">Ghana</p>
                </div>
              </li>
            </ul>

            {/* Services */}
            <div className="mt-6">
              <h4 className="font-heading font-medium text-foreground mb-2 text-sm">Services</h4>
              <div className="flex flex-wrap gap-1">
                {["Weddings", "Traditional", "Portraits", "Events"].map((service) => (
                  <span key={service} className="px-2 py-1 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Alliswell Shot It. All rights reserved. Made with ❤️ in Ghana.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
