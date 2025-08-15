"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building2, Wallet, Shield, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PaymentMethod {
  id: string
  name: string
  type: string
  provider: string
  processing_fee_percentage: number
  minimum_amount: number
  maximum_amount: number
  icon_url?: string
}

interface PaymentFormProps {
  bookingId: string
  amount: number
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
}

const paymentIcons: { [key: string]: any } = {
  mobile_money: Smartphone,
  card: CreditCard,
  bank_transfer: Building2,
  digital_wallet: Wallet,
}

export function PaymentForm({ bookingId, amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select")

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .lte("minimum_amount", amount)
        .gte("maximum_amount", amount)
        .order("display_order")

      if (error) throw error
      setPaymentMethods(data || [])
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      toast.error("Failed to load payment methods")
    }
  }

  const calculateTotal = () => {
    const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod)
    if (!selectedMethodData) return amount

    const fee = (amount * selectedMethodData.processing_fee_percentage) / 100
    return amount + fee
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method")
      return
    }

    const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod)
    if (!selectedMethodData) return

    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      // Create payment record
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("User not authenticated")

      const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const totalAmount = calculateTotal()
      const fee = totalAmount - amount

      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          booking_id: bookingId,
          user_id: user.user.id,
          payment_method_id: selectedMethod,
          amount: totalAmount,
          payment_reference: paymentReference,
          payment_method_type: selectedMethodData.type,
          payment_provider: selectedMethodData.provider,
          phone_number: selectedMethodData.type === "mobile_money" ? phoneNumber : null,
          transaction_fee: fee,
          net_amount: amount,
          status: "pending",
        })
        .select()
        .single()

      if (paymentError) throw paymentError

      // Simulate payment processing based on method type
      await processPayment(selectedMethodData, payment.id, paymentReference, totalAmount)
    } catch (error: any) {
      console.error("Payment error:", error)
      setPaymentStep("select")
      onPaymentError(error.message || "Payment failed")
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const processPayment = async (method: PaymentMethod, paymentId: string, reference: string, total: number) => {
    // Simulate different payment flows
    switch (method.type) {
      case "mobile_money":
        await processMobileMoneyPayment(method, reference, total)
        break
      case "card":
        await processCardPayment(method, reference, total)
        break
      case "bank_transfer":
        await processBankTransferPayment(method, reference, total)
        break
      case "digital_wallet":
        await processDigitalWalletPayment(method, reference, total)
        break
      default:
        throw new Error("Unsupported payment method")
    }

    // Update payment status to completed (in real implementation, this would be done via webhook)
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        payment_date: new Date().toISOString(),
        external_reference: `EXT_${reference}`,
      })
      .eq("id", paymentId)

    if (updateError) throw updateError

    setPaymentStep("success")
    setTimeout(() => {
      onPaymentSuccess(paymentId)
    }, 2000)
  }

  const processMobileMoneyPayment = async (method: PaymentMethod, reference: string, amount: number) => {
    // Simulate mobile money payment flow
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In real implementation, integrate with:
    // - MTN Mobile Money API
    // - Vodafone Cash API
    // - AirtelTigo Money API
    toast.success(`Mobile Money payment initiated. Check your phone for approval.`)
  }

  const processCardPayment = async (method: PaymentMethod, reference: string, amount: number) => {
    // Simulate card payment flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In real implementation, integrate with Paystack or Flutterwave
    toast.success("Card payment processed successfully")
  }

  const processBankTransferPayment = async (method: PaymentMethod, reference: string, amount: number) => {
    // Simulate bank transfer flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Bank transfer initiated successfully")
  }

  const processDigitalWalletPayment = async (method: PaymentMethod, reference: string, amount: number) => {
    // Simulate digital wallet payment flow
    await new Promise((resolve) => setTimeout(resolve, 2500))

    toast.success("Digital wallet payment completed")
  }

  const renderPaymentDetails = () => {
    const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod)
    if (!selectedMethodData) return null

    switch (selectedMethodData.type) {
      case "mobile_money":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Mobile Money Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0XX XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">Enter your {selectedMethodData.name} number</p>
            </div>
          </div>
        )

      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
        )

      case "bank_transfer":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Bank Transfer Details</h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p>
                  <strong>Bank:</strong> Alliswell Shot It Business Account
                </p>
                <p>
                  <strong>Account Number:</strong> 1234567890
                </p>
                <p>
                  <strong>Reference:</strong> {bookingId.slice(0, 8)}
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (paymentStep === "processing") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
          <p className="text-muted-foreground">Please wait while we process your payment...</p>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === "success") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground">Your booking has been confirmed.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <Label className="text-base font-medium">Choose Payment Method</Label>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const IconComponent = paymentIcons[method.type] || CreditCard
                return (
                  <div key={method.id} className="relative">
                    <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-accent/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                    >
                      <IconComponent className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">Fee: {method.processing_fee_percentage}%</div>
                      </div>
                      {method.type === "mobile_money" && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </Label>
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Payment Details */}
        {selectedMethod && (
          <div className="space-y-4">
            <Separator />
            <div>
              <Label className="text-base font-medium">Payment Details</Label>
              <div className="mt-3">{renderPaymentDetails()}</div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {selectedMethod && (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing Fee</span>
                <span>GH₵ {(calculateTotal() - amount).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>GH₵ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button onClick={handlePayment} disabled={!selectedMethod || isProcessing} className="w-full" size="lg">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay GH₵ ${calculateTotal().toFixed(2)}`
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </CardContent>
    </Card>
  )
}
