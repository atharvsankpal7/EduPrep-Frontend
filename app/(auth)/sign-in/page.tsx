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
  DialogFooter,
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
      if(response.status === 401) {
        setErrorMessage("Invalid credentials. Please try again.");
        setErrorDialogOpen(true);
        return;
      }
      if (!response.ok) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setErrorDialogOpen(true);
        return;
      }
      if(response.status === 500) {
        setErrorMessage("Invalid username or password. Please try again.");
        setErrorDialogOpen(true);
        return;
      }
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setErrorDialogOpen(true);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Invalid credentials. Please try again.");
        setErrorDialogOpen(true);
        return;
      }

      login(data.data.user);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Get the callback URL from the search params or default to home
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      
      if (data.data.user.role === "admin") {
        router.push("/admin/students");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
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
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>

        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-6">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold text-red-600">Sign In Failed</DialogTitle>
              <DialogDescription className="text-base text-red-500">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="default" onClick={() => setErrorDialogOpen(false)} className="w-full">
                Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}