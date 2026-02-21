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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLogin } from "@/lib/api/hooks/useAuth";
import { getAuthErrorMessage } from "@/lib/api/errors";

const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters"),
});

export default function SignInPage() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  function onSubmit(values: { email: string; password: string }) {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(data.data.user.role === "admin" ? "/admin" : callbackUrl);
      },
      onError: (error) => {
        setErrorMessage(getAuthErrorMessage(error, "login"));
        setErrorDialogOpen(true);
      },
    });
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
          <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" autoComplete="email" {...field} />
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
                    <Input placeholder="********" type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={loginMutation.isPending || !emailForm.formState.isValid}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
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