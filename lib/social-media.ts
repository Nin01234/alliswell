export interface SocialMediaLink {
  platform: string
  url: string
  handle: string
  icon: string
  color: string
  isActive: boolean
  displayOrder: number
}

export const socialMediaLinks: SocialMediaLink[] = [
  {
    platform: "instagram",
    url: "https://instagram.com/alliswellshotit",
    handle: "@alliswellshotit",
    icon: "Instagram",
    color: "#E4405F",
    isActive: true,
    displayOrder: 1
  },
  {
    platform: "facebook",
    url: "https://facebook.com/alliswellshotit",
    handle: "Alliswell Shot It",
    icon: "Facebook",
    color: "#1877F2",
    isActive: true,
    displayOrder: 2
  },
  {
    platform: "twitter",
    url: "https://twitter.com/alliswellshotit",
    handle: "@alliswellshotit",
    icon: "Twitter",
    color: "#1DA1F2",
    isActive: true,
    displayOrder: 3
  },
  {
    platform: "youtube",
    url: "https://youtube.com/@alliswellshotit",
    handle: "@alliswellshotit",
    icon: "Youtube",
    color: "#FF0000",
    isActive: true,
    displayOrder: 4
  },
  {
    platform: "tiktok",
    url: "https://tiktok.com/@alliswellshotit",
    handle: "@alliswellshotit",
    icon: "TikTok",
    color: "#000000",
    isActive: true,
    displayOrder: 5
  },
  {
    platform: "whatsapp",
    url: "https://wa.me/233308131617",
    handle: "+233 308 131 617",
    icon: "MessageCircle",
    color: "#25D366",
    isActive: true,
    displayOrder: 6
  },
  {
    platform: "telegram",
    url: "https://t.me/alliswellshotit",
    handle: "@alliswellshotit",
    icon: "Send",
    color: "#0088CC",
    isActive: true,
    displayOrder: 7
  }
]

export const getActiveSocialLinks = () => {
  return socialMediaLinks.filter(link => link.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
}

export const getSocialLinkByPlatform = (platform: string) => {
  return socialMediaLinks.find(link => link.platform === platform)
}
