"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BACKEND_URL } from "@/lib/constant";

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must not exceed 15 digits")
    .regex(/^\d+$/, "Contact number must contain only digits"),
});

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const register = useAuthStore((state) => state.login);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      city: "",
      contactNumber: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Registration failed");
        setErrorModal(true);
        throw new Error(data.message);
      }

      register(data.data.user);
      router.push("/");
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
      setErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Enter your information to get started
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>

        <Dialog open={errorModal} onOpenChange={setErrorModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <p className="text-red-500">{errorMessage}</p>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
