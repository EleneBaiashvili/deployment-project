
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Send, ServerOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [answer, setAnswer] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [backendOffline, setBackendOffline] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchAnswer = async () => {
    try {
      setRefreshing(true);
      setBackendOffline(false);
      const apiUrl = import.meta.env.VITE_API_URL || "https://234b823d-3510-481f-81ed-dd85c960e9d7.lovableproject.com/api";
      console.log(`Attempting to fetch from: ${apiUrl}/answer`);
      
      const response = await fetch(`${apiUrl}/answer`, {
        // Adding cache control to prevent caching issues
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      setAnswer(data.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error loading data. Please try again.");
      setLoading(false);
      setRefreshing(false);
      setBackendOffline(true);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the backend server. Please check if it's running.",
        variant: "destructive",
      });
    }
  };

  const submitNewText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    
    try {
      setSubmitting(true);
      setBackendOffline(false);
      const apiUrl = import.meta.env.VITE_API_URL || "https://234b823d-3510-481f-81ed-dd85c960e9d7.lovableproject.com/api";
      console.log(`Attempting to post to: ${apiUrl}/create-answer`);
      
      const response = await fetch(`${apiUrl}/create-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ data: newText }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit data: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "New text submitted successfully!",
      });
      
      setNewText("");
      fetchAnswer(); // Refresh the displayed data
    } catch (error) {
      console.error("Error submitting new text:", error);
      setBackendOffline(true);
      toast({
        title: "Connection Error",
        description: "Failed to submit text. Is the backend server running?",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAnswer();
    
    // Set up polling with increasing intervals if backend is offline
    const interval = setInterval(fetchAnswer, backendOffline ? 10000 : 5000);
    return () => clearInterval(interval);
  }, [backendOffline]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">Deployment Assignment</h1>
            <p className="text-gray-600">
              This page displays the most recent data received by the backend API.
            </p>
          </div>
          
          {backendOffline && (
            <Alert variant="destructive" className="animate-pulse">
              <ServerOff className="h-4 w-4" />
              <AlertTitle>Backend Connection Issue</AlertTitle>
              <AlertDescription>
                Cannot connect to the backend server at {import.meta.env.VITE_API_URL || "http://localhost:3001"}. 
                Please ensure the server is running and accessible.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-sm font-medium text-blue-800 mb-2">Latest Received Data:</h2>
            <div className="bg-white p-3 rounded border border-blue-100 min-h-[50px] flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <span 
                  id="answer" 
                  className="font-mono text-gray-800 break-all"
                >
                  {answer}
                </span>
              )}
            </div>
          </div>
          
          <form onSubmit={submitNewText} className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter new text to submit..."
                className="flex-1"
                disabled={submitting}
              />
              <Button 
                type="submit" 
                disabled={submitting || !newText.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
          
          <div className="flex justify-center">
            <Button
              onClick={fetchAnswer}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Data"
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>The backend API accepts POST requests at:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/create-answer
            </code>
            <p className="mt-1">with JSON body: {`{ "data": "your-text-here" }`}</p>
            <p className="mt-2 text-xs text-amber-600">
              Remember to start the backend server with <code>node src/backend/server.js</code>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
