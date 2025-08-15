"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, Shield, CheckCircle } from "lucide-react"

interface SimplePaymentFormProps {
  amount: number
  bookingId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function SimplePaymentForm({ amount, bookingId, onSuccess, onError }: SimplePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("mobile_money")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber) {
      onError?.("Please enter your phone number")
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would integrate with a payment gateway here
      // For now, we'll simulate success
      setShowSuccess(true)
      onSuccess?.()
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setPhoneNumber("")
      }, 3000)
      
    } catch (error) {
      onError?.("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-700">Your booking has been confirmed. We'll be in touch soon!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Display */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">GH₵ {amount}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Booking ID: {bookingId}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`p-3 border rounded-lg text-left transition-all ${
                  paymentMethod === "mobile_money"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">M</span>
                  </div>
                  <div>
                    <div className="font-medium">Mobile Money</div>
                    <div className="text-xs text-muted-foreground">MTN, Vodafone, Airtel</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`p-3 border rounded-lg text-left transition-all ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">B</span>
                  </div>
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-xs text-muted-foreground">Direct bank deposit</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Number Input */}
          {paymentMethod === "mobile_money" && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 0241234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your mobile money registered phone number
              </p>
            </div>
          )}

          {/* Bank Details */}
          {paymentMethod === "bank_transfer" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div>
                  <span className="font-medium">Bank:</span> Ghana Commercial Bank
                </div>
                <div>
                  <span className="font-medium">Account Name:</span> AllisWell Photography
                </div>
                <div>
                  <span className="font-medium">Account Number:</span> 1234567890
                </div>
                <div>
                  <span className="font-medium">Reference:</span> {bookingId}
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your payment details.</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing || (paymentMethod === "mobile_money" && !phoneNumber)}
            className="w-full bg-primary hover:bg-accent text-white py-3 transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Lock className="h-4 w-4 mr-2 animate-pulse" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay GH₵ {amount}
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
