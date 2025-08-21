import React, { useState } from "react";
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RequestForm } from './RequestForm';
import { LostAndFound } from './LostAndFound';
import { Inventory } from './Inventory';
import { AdminTodoList } from './AdminTodoList';
import citeLogo from "../assets/logos/cite.png";
import casLogo from "../assets/logos/cas.png";
import cbaLogo from "../assets/logos/cba.png";
import cnahsLogo from "../assets/logos/cnahs.png";
import ccjeLogo from "../assets/logos/ccje.png";

import { FileText, Package2, Search, ClipboardList, Building } from "lucide-react";
import type {ServiceRequest } from './types';

const departments = [
  { logo: citeLogo, title: "CITE", desc: "College of Information Technology Education" },
  { logo: casLogo, title: "CAS", desc: "College of Arts and Sciences" },
  { logo: cbaLogo, title: "CBA", desc: "College of Business Administration" },
  { logo: cnahsLogo, title: "CNAHS", desc: "College of Nursing and Allied Health Sciences" },
  { logo: ccjeLogo, title: "CCJE", desc: "College of Criminal Justice Education" },
];

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      title: 'Projector not working',
      description: 'The projector in Room 101 is not turning on.',
      category: 'Electrical Issues',
      priority: 'high',
      building: 'CITE',
      room: '101',
      location: 'CITE 101',
      department: 'CITE',
      requestedBy: 'John Doe',
      requestedAt: new Date().toISOString(),
      status: 'ongoing',
    },
  ]);

  const handleNewRequest = (request: ServiceRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  if (!user) return null;

  const getDashboardContent = () => {
    switch (user.role) {
      case "student":
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
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>
                    Access the Lost & Found records here
                  </CardDescription>
                </CardHeader>
              </Card>
              <LostAndFound />
            </TabsContent>
          </Tabs>
        );

      case "teacher":
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
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>Faculty portal for service requests</CardDescription>
                </CardHeader>
              </Card>

              <RequestForm user={{ name: user.name }} onSubmit={handleNewRequest} />

              {requests.length > 0 && (
  <div className="space-y-2 mt-6">
    <h3 className="text-lg font-semibold">Your Submitted Requests</h3>
    {requests.map((req) => (
      <Card key={req.id} className="bg-white p-3">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{req.title}</CardTitle>
          {/* Display status here */} 
          <Badge 
            variant={req.status === 'done' ? 'secondary' : 'outline'} 
            className="capitalize text-xs"
          >
            {req.status}
          </Badge>
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
)}

            </TabsContent>

            <TabsContent value="lost-found" className="bg-white p-4 rounded-lg shadow">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        );

      case "admin":
        return (
          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todo">
                <ClipboardList className="mr-2 h-4 w-4" /> Task Management
              </TabsTrigger>
              <TabsTrigger value="requests">
                <FileText className="mr-2 h-4 w-4" /> All Requests
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Package2 className="mr-2 h-4 w-4" /> Inventory
              </TabsTrigger>
              <TabsTrigger value="lost-found">
                <Search className="mr-2 h-4 w-4" /> Lost & Found
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todo" className="space-y-4 bg-white p-4 rounded-lg shadow">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Welcome, {user.name}</CardTitle>
                  <CardDescription>
                    Administrative portal for managing GSD operations
                  </CardDescription>
                </CardHeader>
              </Card>
              <AdminTodoList />
            </TabsContent>

            <TabsContent value="requests" className="space-y-6 bg-white p-4 rounded-lg shadow">
              <Card className="bg-white p-4">
                <CardHeader>
                  <CardTitle>
                    {selectedDept ? `${selectedDept} Requests` : "Departments"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDept
                      ? "Here are all service requests for this department"
                      : "Select a department to view their service requests"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {!selectedDept ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {departments.map((dept, index) => (
                        <Card
                          key={index}
                          onClick={() => setSelectedDept(dept.title)}
                          className="cursor-pointer hover:shadow-lg transition-shadow rounded-xl p-4 flex flex-col items-center text-center bg-white"
                        >
                          <img
                            src={dept.logo}
                            alt={`${dept.title} logo`}
                            className="w-20 h-20 object-contain mb-3"
                          />
                          <CardTitle className="text-lg font-semibold">{dept.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">{dept.desc}</CardDescription>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button variant="outline" onClick={() => setSelectedDept(null)}>
                        ← Back to Departments
                      </Button>

                      <div className="grid gap-4">
                        {requests
                          .filter(req => req.building.includes(selectedDept))
                          .map(req => (
                            <div
                              key={req.id}
                              className="flex flex-col border-l-4 border-primary bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">{req.title}</h3>
                                <Badge variant="outline" className="text-xs capitalize">{req.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{req.location}</p>
                              <p className="text-xs text-muted-foreground">{req.description}</p>
                              <p className="text-xs text-muted-foreground">Submitted by: {req.requestedBy}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 bg-white p-4 rounded-lg shadow">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Manage and monitor available equipment and supplies</CardDescription>
                </CardHeader>
              </Card>
              <Inventory />
            </TabsContent>

            <TabsContent value="lost-found" className="bg-white p-4 rounded-lg shadow">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-semibold">GSD Portal</h1>
                <p className="text-sm text-muted-foreground">General Service Department</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="capitalize">{user.role}</Badge>
                </p>
              </div>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </main>
    </div>
  );
};
