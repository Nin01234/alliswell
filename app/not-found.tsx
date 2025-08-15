import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="text-center max-w-md">
        <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Button asChild className="bg-primary hover:bg-accent">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
