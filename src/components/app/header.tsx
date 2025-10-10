"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { CircleUser, Cog, Menu, LogOut, Mail } from "lucide-react";
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
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { AuthContext } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsSheet } from "./settings-sheet";
import { EmailAuthDialog } from "./email-auth-dialog";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const auth = getAuth();
  const user = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
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
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Flowtime</span>
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
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
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Flowtime</span>
              </Link>
              <Link href="#" className="hover:text-foreground">
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSheetOpen(true)}
            >
              <Cog className="h-6 w-6" />
              <span className="sr-only">Open Settings</span>
            </Button>
          </div>

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
                <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                  <Cog className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
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
                  Sign in with Google
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openEmailAuthDialog('signIn')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Login</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openEmailAuthDialog('signUp')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Sign Up</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSheetOpen(true)}>
            <Cog className="h-6 w-6" />
            <span className="sr-only">Open Settings</span>
          </Button>
        </div>
      </header>
      <SettingsSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EmailAuthDialog
        open={isEmailAuthOpen}
        onOpenChange={setIsEmailAuthOpen}
        mode={emailAuthMode}
      />
    </>
  );
}
