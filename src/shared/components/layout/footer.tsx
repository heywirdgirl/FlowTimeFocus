"use client";

import { Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="container mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-foreground">About</a>
                    <a href="#" className="hover:text-foreground">Terms</a>
                    <a href="#" className="hover:text-foreground">Contact</a>
                </div>
                <span>v1.0 - 2025</span>
                <a href="#" className="hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                </a>
            </div>
        </footer>
    )
}
