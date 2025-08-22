import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { LostAndFound } from "../../components/LostAndFound/LostAndFound";
import { Search } from "lucide-react";

interface Props {
  userName: string;
}

export const StudentDashboard: React.FC<Props> = ({ userName }) => {
  return (
    <Tabs defaultValue="lost-found" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="lost-found">
          <Search className="mr-2 h-4 w-4" /> Lost & Found
        </TabsTrigger>
      </TabsList>
      <TabsContent value="lost-found">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Welcome, {userName}</CardTitle>
            <CardDescription>
              Access the Lost & Found records here
            </CardDescription>
          </CardHeader>
        </Card>
        <LostAndFound />
      </TabsContent>
    </Tabs>
  );
};
