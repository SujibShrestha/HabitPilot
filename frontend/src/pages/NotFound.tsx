import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-xl">
        
        {/* 404 */}
        <h1 className="text-7xl font-bold tracking-tight text-primary">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-2 text-muted-foreground">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg">
              Go Home
            </Button>
          </Link>

          <Link to="/workouts">
            <Button variant="outline" size="lg">
              Browse Workouts
            </Button>
          </Link>
        </div>

        {/* Card style tip */}
        <div className="mt-10 border border-border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">
            If you think this is an error, try refreshing the page or returning home.
          </p>
        </div>

      </div>
    </div>
  )
}

export default NotFound