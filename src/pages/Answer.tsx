
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Answer = () => {
  const [answer, setAnswer] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://234b823d-3510-481f-81ed-dd85c960e9d7.lovableproject.com/api";
        const response = await fetch(`${apiUrl}/answer`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        setAnswer(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching answer:", error);
        setAnswer("Error loading data");
        setLoading(false);
      }
    };

    fetchAnswer();
    // Check for updates every 3 seconds
    const interval = setInterval(fetchAnswer, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Answer Page</h1>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-2 text-center">The most recent data received:</p>
          <div className="bg-white p-4 rounded border border-blue-100 text-center">
            {loading ? (
              <Loader2 className="h-5 w-5 mx-auto text-blue-500 animate-spin" />
            ) : (
              <span id="answer" className="font-mono text-gray-800 break-all">
                {answer}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Answer;
