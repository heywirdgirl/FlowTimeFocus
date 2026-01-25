import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl md:text-7xl">
          A Pomodoro Timer for Deep Work
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Focus, work, and rest with a timer designed to help you achieve more.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
