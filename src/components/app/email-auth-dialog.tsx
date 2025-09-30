
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface EmailAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailAuthDialog({ open, onOpenChange }: EmailAuthDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created",
          description: `Welcome, ${result.user.email}!`,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed In",
          description: "Welcome back!",
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Auth Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"} with Email</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="name@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </Button>
          <Button onClick={handleEmailAuth}>{isSignUp ? "Sign Up" : "Sign In"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
