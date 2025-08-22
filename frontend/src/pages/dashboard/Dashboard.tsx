import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { StudentDashboard } from "./StudentDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Building } from "lucide-react";
import type { ServiceRequest } from "../types";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/servicerequest/requests", {
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests(); // initial fetch

    const interval = setInterval(fetchRequests, 1000); // fetch every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const handleNewRequest = (request: ServiceRequest) => {
    setRequests((prev) => [request, ...prev]);
  };

  if (!user) return null;
  if (loading) return <p className="text-center mt-10">Loading requests...</p>;

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard userName={user.name} />;
      case "teacher":
        return (
          <TeacherDashboard
            userName={user.name}
            requests={requests}
            onSubmit={handleNewRequest}
          />
        );
      case "admin":
        return <AdminDashboard userName={user.name} requests={requests} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-semibold">GSD Portal</h1>
                <p className="text-sm text-muted-foreground">
                  General Service Department
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};
