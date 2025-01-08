"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

const BACKEND_URL = `http://localhost:5000/api/v1`;

const emailFormSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8).max(64),
});

const urnFormSchema = z.object({
  urn: z.string().min(8, "URN must be at least 8 characters"),
  password: z.string().min(8).max(64),
});

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const emailForm = useForm({
    defaultValues: { email: "", password: "" },
  });

  const urnForm = useForm({
    defaultValues: { urn: "", password: "" },
  });

  async function onSubmit(
    values:
      | { email: string; password: string }
      | { urn: string; password: string }
  ) {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      login(data.data.user);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials.",
        variant: "destructive",
      });
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="urn">URN</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="urn">
            <Form {...urnForm}>
              <form
                onSubmit={urnForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={urnForm.control}
                  name="urn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your URN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={urnForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}