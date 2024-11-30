"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  testId: z.string().min(3, "Test ID must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  deadline: z.date(),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
});

interface TestSettingsProps {
  availableTopics: string[];
  onSave: (settings: z.infer<typeof formSchema>) => void;
}

export function TestSettings({ availableTopics, onSave }: TestSettingsProps) {
  const [date, setDate] = useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testId: "",
      password: "",
      duration: 60,
      topics: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const testLink = `${window.location.origin}/test/${values.testId}`;
    onSave(values);
    
    // Copy test details to clipboard
    const testDetails = `Test Link: ${testLink}\nPassword: ${values.password}`;
    navigator.clipboard.writeText(testDetails);
    
    toast({
      title: "Test Created Successfully",
      description: "Test details have been copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="testId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="60" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Submission Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Topics</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {availableTopics.map((topic) => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={topic}
                      onCheckedChange={(checked) => {
                        const currentTopics = form.getValues("topics");
                        if (checked) {
                          form.setValue("topics", [...currentTopics, topic]);
                        } else {
                          form.setValue(
                            "topics",
                            currentTopics.filter((t) => t !== topic)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={topic}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Test
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}