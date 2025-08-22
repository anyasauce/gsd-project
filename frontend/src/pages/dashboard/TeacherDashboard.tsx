import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { RequestForm } from "../../components/RequestForm/RequestForm";
import { LostAndFound } from "../../components/LostAndFound/LostAndFound";
import { FileText, Search } from "lucide-react";
import type { ServiceRequest } from "../../pages/types";

interface Props {
  userName: string;
  requests: ServiceRequest[];
  onSubmit: (req: ServiceRequest) => void;
}

export const TeacherDashboard: React.FC<Props> = ({ userName, requests, onSubmit }) => {
  return (
    <Tabs defaultValue="request" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="request">
          <FileText className="mr-2 h-4 w-4" /> Submit Request
        </TabsTrigger>
        <TabsTrigger value="lost-found">
          <Search className="mr-2 h-4 w-4" /> Lost & Found
        </TabsTrigger>
      </TabsList>

      <TabsContent value="request" className="space-y-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Welcome, {userName}</CardTitle>
            <CardDescription>Faculty portal for service requests</CardDescription>
          </CardHeader>
        </Card>

        <RequestForm user={{ name: userName }} onSubmit={onSubmit} />

        {requests.length > 0 ? (
          <div className="space-y-2 mt-6">
            <h3 className="text-lg font-semibold">Your Submitted Requests</h3>
            {requests.map((req) => (
              <Card key={req.id} className="bg-white p-3">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>{req.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.location} | {req.category} | Priority: {req.priority}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted at: {new Date(req.requestedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No requests submitted yet.</p>
        )}
      </TabsContent>

      <TabsContent value="lost-found" className="bg-white p-4 rounded-lg shadow">
        <LostAndFound />
      </TabsContent>
    </Tabs>
  );
};
