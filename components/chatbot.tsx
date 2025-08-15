"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

const welcomeMessages = [
  "Hello! Welcome to Alliswell Shot It Photography! How can I help you today?",
  "Welcome! I'm the Alliswell Shot It assistant. How can I assist you with our photography services?",
  "Hi there! Ready to capture beautiful moments? I'm here to help with Alliswell Shot It Photography services!",
]

const quickReplies = [
  {
    text: "📸 View Portfolio",
    action: "portfolio",
    description: "See our latest work and photography styles",
  },
  {
    text: "💰 Pricing & Packages",
    action: "pricing",
    description: "Learn about our photography packages and rates",
  },
  {
    text: "📅 Book a Session",
    action: "booking",
    description: "Schedule your photography session with us",
  },
  {
    text: "📍 Location & Hours",
    action: "location",
    description: "Find our studio location and working hours",
  },
  {
    text: "📞 Contact Info",
    action: "contact",
    description: "Get our phone numbers and email address",
  },
]

const responses = {
  portfolio: "📸 Our portfolio showcases various photography styles including:\n\n• Wedding Photography\n• Traditional Ceremonies\n• Portrait Sessions\n• Event Photography\n• Tourism & Travel\n• Corporate Events\n\nYou can view our full portfolio at our website or Instagram @alliswellshotit!",
  
  pricing: "💰 Our photography packages start from:\n\n• Portrait Sessions: GHS 500+\n• Event Photography: GHS 800+\n• Wedding Photography: GHS 2,500+\n• Traditional Ceremonies: GHS 1,500+\n\nPrices vary based on duration, location, and specific requirements. Contact us for a detailed quote!",
  
  booking: "📅 To book a session:\n\n1. Contact us via phone or email\n2. Discuss your requirements and preferred date\n3. Choose your package\n4. Pay 50% deposit to secure booking\n5. Receive confirmation and details\n\nWe're located in Ashaley Botwe, Accra\n\nWe're also on Instagram @alliswellshotit!",
  
  location: "📍 Our Studio Location:\n\n📍 5 Cassava Street\nAshaley Botwe, Accra, Ghana\n\n📞 Phone: +233 308 131 617\n📧 Email: productions.alliswell@gmail.com\n\n⏰ Working Hours:\nMonday - Friday: 8:00 AM - 9:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: By appointment only\n\nWe also travel throughout Ghana for events!",
  
  contact: "📞 Contact Information:\n\n📱 Phone Numbers:\n• +233 308 131 617\n• +233 552 727 570\n\n📧 Email: productions.alliswell@gmail.com\n\n📍 Address: 5 Cassava Street, Ashaley Botwe, Accra\n\n📱 Social Media:\n• Instagram: @alliswellshotit\n• Facebook: Alliswell Shot It\n• Twitter: @alliswellshotit\n• YouTube: @alliswellshotit\n• TikTok: @alliswellshotit\n• WhatsApp: +233 308 131 617\n• Telegram: @alliswellshotit\n\nFeel free to ask me about our photography services, pricing, booking process, or anything else about Alliswell Shot It Photography!",
}

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
  }

  if (lowerMessage.includes("service") || lowerMessage.includes("what do you offer")) {
    return responses.portfolio
  }

  if (lowerMessage.includes("book") || lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
    return responses.booking
  }

  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
    return responses.pricing
  }

  if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("address")) {
    return responses.location
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
    return responses.contact
  }

  if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("money")) {
    return responses.pricing // Assuming payment is related to pricing
  }

  return responses.contact
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the Alliswell Shot It assistant. How can I help you with our photography services today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getBotResponse(inputValue),
          isBot: true,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? "hidden" : "flex"
        }`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Alliswell Shot It Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isBot ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.isBot ? (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="text-sm whitespace-pre-line">{message.content}</div>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
