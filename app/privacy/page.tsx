import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Mail, Phone } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Eye className="h-6 w-6" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Booking details and event information</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication preferences</li>
                <li>Photos and content you share with us</li>
              </ul>

              <h4 className="font-semibold text-lg mt-6">Automatically Collected Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Usage patterns and preferences</li>
                <li>Location data (with your permission)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Database className="h-6 w-6" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our photography services</li>
                <li>Process bookings and payments</li>
                <li>Communicate about your sessions and deliverables</li>
                <li>Send important updates and notifications</li>
                <li>Customize your experience on our platform</li>
                <li>Comply with legal obligations</li>
                <li>Protect against fraud and unauthorized access</li>
              </ul>

              <h4 className="font-semibold text-lg mt-6">Marketing Communications</h4>
              <p>
                With your consent, we may send you promotional emails about our services, special offers, and
                photography tips. You can opt out at any time using the unsubscribe link in our emails.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                3. Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">We Do Not Sell Your Information</h4>
              <p>We do not sell, trade, or rent your personal information to third parties for marketing purposes.</p>

              <h4 className="font-semibold text-lg">Limited Sharing</h4>
              <p>We may share your information only in these circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Service Providers:</strong> Trusted partners who help us operate our business (payment
                  processors, cloud storage, email services)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly agree to sharing
                </li>
              </ul>

              <h4 className="font-semibold text-lg mt-6">Photography Usage</h4>
              <p>
                We may use photographs from your sessions for portfolio and marketing purposes unless you specifically
                opt out. Your identity will be protected, and we will not share personal details without permission.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                4. Data Security and Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-lg">Security Measures</h4>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure cloud storage with backup systems</li>
                <li>Access controls and authentication</li>
                <li>Regular security audits and updates</li>
                <li>Staff training on data protection</li>
              </ul>

              <h4 className="font-semibold text-lg mt-6">Data Retention</h4>
              <p>
                We retain your personal information for as long as necessary to provide services and comply with legal
                obligations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information: Until account deletion</li>
                <li>Booking records: 7 years for tax and legal purposes</li>
                <li>Photographs: Minimum 2 years, longer with consent</li>
                <li>Marketing data: Until you unsubscribe</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                5. Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your personal information:</p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Access and Portability</h5>
                  <p className="text-sm">Request a copy of your personal data in a portable format</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Correction</h5>
                  <p className="text-sm">Update or correct inaccurate personal information</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Deletion</h5>
                  <p className="text-sm">Request deletion of your personal data (subject to legal requirements)</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Opt-out</h5>
                  <p className="text-sm">Unsubscribe from marketing communications at any time</p>
                </div>
              </div>

              <p className="mt-4">
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                6. Cookies and Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use cookies and similar technologies to enhance your experience:</p>

              <h4 className="font-semibold text-lg">Types of Cookies</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic website functionality
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how you use our site
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences and settings
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)
                </li>
              </ul>

              <p>
                You can control cookies through your browser settings, but disabling certain cookies may affect website
                functionality.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">7. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our website and services integrate with third-party providers:</p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Payment Processors:</strong> Paystack, Mobile Money providers
                </li>
                <li>
                  <strong>Cloud Storage:</strong> Supabase, Google Cloud
                </li>
                <li>
                  <strong>Email Services:</strong> Resend, SendGrid
                </li>
                <li>
                  <strong>Analytics:</strong> Google Analytics (anonymized)
                </li>
                <li>
                  <strong>Social Media:</strong> Instagram, Facebook integration
                </li>
              </ul>

              <p>These services have their own privacy policies, and we encourage you to review them.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information
                from children under 13. If we become aware that we have collected such information, we will take steps
                to delete it promptly.
              </p>

              <p>
                For photography services involving minors, we require parental consent and may have additional privacy
                protections in place.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                9. International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than Ghana, including the United
                States and European Union, where our service providers are located. We ensure appropriate safeguards are
                in place to protect your information during such transfers.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300">
                10. Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our platform</li>
              </ul>

              <p>
                Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Mail className="h-6 w-6" />
                11. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-4">Alliswell Shot It Photography</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span>+233 30 813 1617</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span>+233 55 272 7570</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span>productions.alliswell@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Data Protection Officer</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                  <p className="text-sm">
                    📍 5 Cassava Street, Ashaley Botwe, Accra, Ghana
                    <br />🌐 Instagram: @alliswellshotit
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                We will respond to your privacy-related inquiries within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
