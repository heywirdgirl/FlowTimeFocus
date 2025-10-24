"use client"; // Nếu cần client-side rendering, nhưng nên tránh nếu có thể

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 text-primary underline hover:text-primary/80">
        Go back to Dashboard
      </Link>
    </div>
  );
}