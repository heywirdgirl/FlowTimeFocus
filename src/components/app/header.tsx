// src/components/app/header.tsx

"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { CircleUser, LogOut, Mail, BarChart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; // Giữ lại các import cần thiết
import { auth } from "@/lib/firebase"; // Import auth từ firebase.ts
import { AuthContext } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmailAuthDialog } from "./email-auth-dialog";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const { user } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); // Sử dụng auth từ firebase.ts
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sử dụng auth từ firebase.ts
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEmailAuthDialog = (mode: 'signIn' | 'signUp') => {
    setEmailAuthMode(mode);
    setIsEmailAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden md:flex flex-col gap-6 text-lg font-medium md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <span className="sr-only">Flowtime</span>
          </Link>
          <Link
            href="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className="text-foreground transition-colors hover:text-foreground flex items-center gap-1"
          >
            <BarChart className="h-4 w-4" /> History
          </Link>
        </nav>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsSheetOpen(false)}
              >
                <span className="sr-only">Flowtime</span>
              </Link>
              <Link
                href="/"
                className="hover:text-foreground"
                onClick={() => setIsSheetOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className="hover:text-foreground flex items-center gap-1"
                onClick={() => setIsSheetOpen(false)}
              >
                <BarChart className="h-4 w-4" /> History
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={user.photoURL || ""}
                      alt={user.displayName || ""}
                    />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.displayName || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Guest</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleGoogleSignIn}>
                  Continue with Google
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openEmailAuthDialog('signIn')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Sign In with Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openEmailAuthDialog('signUp')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Sign Up with Email</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <EmailAuthDialog
        open={isEmailAuthOpen}
        onOpenChange={setIsEmailAuthOpen}
        mode={emailAuthMode}
      />
    </>
  );
}