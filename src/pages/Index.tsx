
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [answer, setAnswer] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchAnswer = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/answer`);
      
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
      toast({
        title: "Error",
        description: "Failed to load the answer from the server.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAnswer();
    // Set up polling every 5 seconds to check for updates
    const interval = setInterval(fetchAnswer, 5000);
    return () => clearInterval(interval);
  }, []);

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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
