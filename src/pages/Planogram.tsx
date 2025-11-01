import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Planogram = () => {
  const { serialNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refrigerator, setRefrigerator] = useState<any>(null);
  const [planogramUrl, setPlanogramUrl] = useState<string>("");

  useEffect(() => {
    const fetchPlanogram = async () => {
      if (!serialNumber) {
        toast.error("No serial number provided");
        navigate("/");
        return;
      }

      try {
        // Fetch refrigerator data with category
        const { data: fridgeData, error: fridgeError } = await supabase
          .from("refrigerators")
          .select(`
            *,
            categories (
              name,
              planogram_url
            )
          `)
          .eq("serial_number", serialNumber)
          .single();

        if (fridgeError) throw fridgeError;

        if (!fridgeData) {
          toast.error("Refrigerator not found");
          navigate("/");
          return;
        }

        setRefrigerator(fridgeData);
        setPlanogramUrl(fridgeData.categories.planogram_url);
      } catch (error) {
        console.error("Error fetching planogram:", error);
        toast.error("Failed to load planogram");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanogram();
  }, [serialNumber, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading planogram...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/scanner")}
            className="gap-2"
          >
            <QrCode className="h-4 w-4" />
            Scan Again
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {refrigerator && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h1 className="text-2xl font-bold">{refrigerator.store_name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Serial:</span> {refrigerator.serial_number}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {refrigerator.categories.name}
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-lg p-4">
            <img
              src={planogramUrl}
              alt="Planogram"
              className="w-full h-auto rounded-lg"
              onError={() => {
                toast.error("Failed to load planogram image");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Planogram;