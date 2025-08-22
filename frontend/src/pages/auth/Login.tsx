  import React, { useState } from 'react';
  import { useAuth } from '../context/AuthContext';
  import { Button } from '../../components/ui/button';
  import { Input } from '../../components/ui/input';
  import { Label } from '../../components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
  import { Alert, AlertDescription } from '../../components/ui/alert';
  import { Loader2 } from 'lucide-react';

  export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Try: student@university.edu, teacher@university.edu, or admin@university.edu with password "password"');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <Card className="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Side - Logo & Welcome */}
            <div className="bg-blue-600 text-white flex flex-col justify-center items-center p-10 md:w-1/2">
              <img src="/logo.png" alt="Logo" className="w-40 h-40 mb-6 object-contain" />
              <h1 className="text-4xl font-bold mb-4 text-center">Welcome to GSD Portal</h1>
              <p className="text-center text-lg opacity-90 max-w-sm">
                General Service Department Request System
              </p>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white p-10">
              <CardHeader className="space-y-1 mb-6">
                <CardTitle className="text-center text-3xl font-semibold">Sign In</CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Access your account securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-lg font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                
                {/* Demo Accounts */}
                <div className="text-sm text-gray-500 text-center mt-6">
                  <p className="font-semibold">Demo accounts:</p>
                  <p>student@university.edu / password</p>
                  <p>teacher@university.edu / password</p>
                  <p>admin@university.edu / password</p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    );
  };