"use client"

import Link from "next/link"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  MessageCircle, 
  Send,
  LucideIcon 
} from "lucide-react"
import { socialMediaLinks, SocialMediaLink } from "@/lib/social-media"

const socialIcons: { [key: string]: LucideIcon } = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
  telegram: Send,
}

interface SocialMediaLinksProps {
  variant?: "default" | "compact" | "hero"
  showHandles?: boolean
  className?: string
}

export function SocialMediaLinks({ 
  variant = "default", 
  showHandles = false,
  className = "" 
}: SocialMediaLinksProps) {
  const activeLinks = socialMediaLinks.filter(link => link.isActive).sort((a, b) => a.displayOrder - b.displayOrder)

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "flex gap-2"
      case "hero":
        return "flex gap-4"
      default:
        return "flex flex-wrap gap-3"
    }
  }

  const getIconSize = () => {
    switch (variant) {
      case "compact":
        return "h-4 w-4"
      case "hero":
        return "h-6 w-6"
      default:
        return "h-5 w-5"
    }
  }

  const getButtonSize = () => {
    switch (variant) {
      case "compact":
        return "w-8 h-8"
      case "hero":
        return "w-12 h-12"
      default:
        return "w-10 h-10"
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {activeLinks.map((link) => {
        const IconComponent = socialIcons[link.platform]
        if (!IconComponent) return null

        return (
          <div key={link.platform} className="group">
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${getButtonSize()} bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary hover:to-primary/90 text-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-soft hover:shadow-lg border border-primary/20 hover:border-primary/50 group-hover:shadow-glow`}
              style={{
                '--tw-shadow-color': link.color,
              } as React.CSSProperties}
            >
              <IconComponent className={getIconSize()} />
            </Link>
            {showHandles && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                  {link.handle}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function SocialMediaHandles() {
  const activeLinks = socialMediaLinks.filter(link => link.isActive).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-2">
      {activeLinks.map((link) => (
        <Link
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: link.color }}
          />
          <span className="text-sm group-hover:font-medium">
            {link.handle}
          </span>
        </Link>
      ))}
    </div>
  )
}
