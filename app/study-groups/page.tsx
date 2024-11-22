"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreateGroupDialog } from "@/components/study-groups/create-group-dialog";

const studyGroups = [
  {
    id: 1,
    name: "Mathematics Masters",
    description: "Advanced mathematics study group focusing on calculus and algebra",
    members: 12,
    category: "Mathematics",
    lastActive: "2 hours ago",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Science Squad",
    description: "Group discussions on physics, chemistry, and biology concepts",
    members: 8,
    category: "Science",
    lastActive: "5 minutes ago",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "English Excellence",
    description: "Improve your English language skills through group practice",
    members: 15,
    category: "English",
    lastActive: "1 day ago",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Groups</h1>
            <p className="text-muted-foreground">
              Join or create study groups to collaborate with fellow learners
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {filteredGroups.map((group) => (
            <motion.div key={group.id} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.image} alt={group.name} />
                      <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle>{group.name}</CardTitle>
                        <Badge variant="secondary">
                          <Users className="mr-1 h-3 w-3" />
                          {group.members} members
                        </Badge>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Last active {group.lastActive}</span>
                    </div>
                    <Button>Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No study groups found matching your search.</p>
          </div>
        )}

        <CreateGroupDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </div>
    </div>
  );
}