
"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleUser, Cog, Menu, LogOut, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { EmailAuthDialog } from "@/features/auth";
import { toast } from "@/shared/hooks/use-toast";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const auth = getAuth();
  const user = useAuthStore((state) => state.user);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In", description: "Welcome!" });
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({ title: "Error", description: "Failed to sign in with Google.", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            {/* You might want a proper logo here */}
            <span className="font-bold text-xl">FlowTime</span>
          </Link>
        </nav>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span className="font-bold text-xl">FlowTime</span>
              </Link>
              {/* Add mobile nav links here if needed */}
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
                      {user.email?.charAt(0).toUpperCase() || 'U'}
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
                <DropdownMenuLabel>Guest Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleGoogleSignIn}>
                  Sign in with Google
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
