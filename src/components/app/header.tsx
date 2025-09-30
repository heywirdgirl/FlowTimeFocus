
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cog, LogOut, User as UserIcon, LogIn } from "lucide-react";
import { SettingsSheet } from "./settings-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Successfully signed in.
          // onAuthStateChanged will handle the user state update.
          toast({
            title: "Signed In",
            description: `Welcome back, ${result.user.displayName}!`,
          });
        }
      } catch (error: any) {
        console.error("Error handling redirect result: ", error);
        toast({
          title: "Sign-in Error",
          description: error.message || "There was a problem signing you in. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleRedirectResult();

    return () => unsubscribe();
  }, [toast]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
       toast({
            title: "Login Error",
            description: "Could not initiate sign-in. Please try again.",
            variant: "destructive",
        });
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
        title: "Sign-out Error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
    });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <>
      <header className="container mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Timecycle
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                     <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">{user.displayName}</p>
                     <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem>
                   <UserIcon className="mr-2 h-4 w-4" />
                   <span>Profile</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                   <Cog className="mr-2 h-4 w-4" />
                   <span>Settings</span>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleSignOut}>
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Log out</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
            ) : (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleSignIn}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSheetOpen(true)}>
              <Cog className="h-6 w-6" />
              <span className="sr-only">Open Settings</span>
            </Button>
          </div>
        </div>
      </header>
      <SettingsSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
