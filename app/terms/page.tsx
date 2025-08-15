import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms and Conditions</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using Alliswell Shot It Photography services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
              <p>
                These terms apply to all visitors, users, and others who access or use our photography services, whether
                in person, online, or through our mobile applications.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">2. Photography Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Service Scope</h4>
              <p>
                Alliswell Shot It Photography provides professional photography services including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Wedding photography and videography</li>
                <li>Portrait and family photography</li>
                <li>Event and corporate photography</li>
                <li>Traditional ceremony documentation</li>
                <li>Graduation and milestone photography</li>
                <li>Tourism and travel photography</li>
              </ul>

              <h4 className="font-semibold text-lg mt-6">Service Delivery</h4>
              <p>
                All photography services will be delivered according to the agreed timeline, typically within 7-14
                business days for edited photos and 2-4 weeks for comprehensive wedding packages.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                3. Booking and Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Booking Requirements</h4>
              <p>
                A booking is confirmed only upon receipt of a signed contract and the required deposit. All bookings are
                subject to availability.
              </p>

              <h4 className="font-semibold text-lg">Payment Schedule</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>50% deposit required to secure booking</li>
                <li>Remaining balance due on the day of service</li>
                <li>Late payments may incur additional fees</li>
                <li>All prices are in Ghana Cedis (GH₵)</li>
              </ul>

              <h4 className="font-semibold text-lg">Accepted Payment Methods</h4>
              <p>
                We accept Mobile Money (MTN, Vodafone, AirtelTigo), credit/debit cards, bank transfers, and digital
                wallets.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                4. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Copyright Ownership</h4>
              <p>
                Alliswell Shot It Photography retains full copyright ownership of all photographs and creative works
                produced. Clients receive usage rights as specified in their service agreement.
              </p>

              <h4 className="font-semibold text-lg">Client Usage Rights</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal use and sharing on social media</li>
                <li>Printing for personal use</li>
                <li>Commercial use requires separate licensing agreement</li>
                <li>Modification of images without permission is prohibited</li>
              </ul>

              <h4 className="font-semibold text-lg">Portfolio Usage</h4>
              <p>
                Alliswell Shot It Photography reserves the right to use photographs for portfolio, marketing, and
                promotional purposes unless explicitly restricted by client agreement.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                5. Cancellation and Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Client Cancellations</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>More than 30 days: Full refund minus 10% processing fee</li>
                <li>15-30 days: 50% refund of total amount</li>
                <li>Less than 15 days: 25% refund of total amount</li>
                <li>Less than 7 days: No refund</li>
              </ul>

              <h4 className="font-semibold text-lg">Force Majeure</h4>
              <p>
                In cases of extreme weather, natural disasters, or other circumstances beyond our control, we will work
                with clients to reschedule or provide appropriate compensation.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                6. Liability and Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Limitation of Liability</h4>
              <p>
                Alliswell Shot It Photography's liability is limited to the total amount paid for services. We are not
                responsible for indirect, consequential, or incidental damages.
              </p>

              <h4 className="font-semibold text-lg">Equipment and Technical Issues</h4>
              <p>
                While we maintain backup equipment and procedures, we cannot guarantee against all technical failures.
                In such cases, we will provide appropriate remedies within our capability.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                7. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We are committed to protecting your privacy and personal information. Please refer to our Privacy Policy
                for detailed information about how we collect, use, and protect your data.
              </p>

              <h4 className="font-semibold text-lg">Image Storage and Security</h4>
              <p>
                All photographs are stored securely with backup systems. We maintain client images for a minimum of 2
                years after service delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Ghana. Any
                disputes arising from these terms will be subject to the jurisdiction of Ghanaian courts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>For questions about these Terms and Conditions, please contact us:</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p>
                  <strong>Alliswell Shot It Photography</strong>
                </p>
                <p>📍 5 Cassava Street, Ashaley Botwe, Accra, Ghana</p>
                <p>📞 +233 30 813 1617 | +233 55 272 7570</p>
                <p>📧 productions.alliswell@gmail.com</p>
                <p>🌐 Instagram: @alliswellshotit</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
