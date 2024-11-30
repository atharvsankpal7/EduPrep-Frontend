"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Users,
  BarChart2,
  LogOut,
  Plus,
  History,
  Play,
} from "lucide-react";

export function TeacherNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <ClipboardList className="w-4 h-4 mr-2" />
            Tests
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 w-[300px]">
              <Link href="/teacher/tests/ongoing" passHref legacyBehavior>
                <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                  <Play className="w-4 h-4" />
                  Ongoing Tests
                </NavigationMenuLink>
              </Link>
              <Link href="/teacher/tests/create" passHref legacyBehavior>
                <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                  <Plus className="w-4 h-4" />
                  Create New Test
                </NavigationMenuLink>
              </Link>
              <Link href="/teacher/tests/previous" passHref legacyBehavior>
                <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                  <History className="w-4 h-4" />
                  Previous Tests
                </NavigationMenuLink>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/teacher/students" passHref legacyBehavior>
            <NavigationMenuLink className="flex items-center gap-2 p-2">
              <Users className="w-4 h-4" />
              Manage Students
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/teacher/reports" passHref legacyBehavior>
            <NavigationMenuLink className="flex items-center gap-2 p-2">
              <BarChart2 className="w-4 h-4" />
              Reports
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>

      <Button variant="ghost" className="ml-4" onClick={() => console.log("Logout")}>
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </NavigationMenu>
  );
}