"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BACKEND_URL } from "@/lib/constant";

const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
});

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  async function onSubmit(values: { email: string; password: string }) {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = "Invalid credentials";
        if (data.message === "User not found") {
          errorMsg = "No account found with these credentials. Please check your details or sign up.";
        } else if (data.message === "Invalid password") {
          errorMsg = "Incorrect password. Please try again.";
        }
        setErrorMessage(errorMsg);
        setErrorDialogOpen(true);
        throw new Error(data.message);
      }

      login(data.data.user);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Get the callback URL from the search params or default to home
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      
      if (data.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading || !emailForm.formState.isValid}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>

        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In Failed</DialogTitle>
              <DialogDescription className="text-red-500">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}