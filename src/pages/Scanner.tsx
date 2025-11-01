import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

const Scanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const qrScanner = new Html5Qrcode("qr-reader");
    scannerRef.current = qrScanner;

    const startScanner = async () => {
      try {
        await qrScanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            toast.success("QR Code detected!");
            qrScanner.stop();
            navigate(`/planogram/${decodedText}`);
          },
          () => {
            // Error callback - silent
          }
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Scanner error:", err);
        toast.error("Failed to start camera. Please check permissions.");
      }
    };

    startScanner();

    return () => {
      if (qrScanner.isScanning) {
        qrScanner.stop().catch(console.error);
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Scan QR Code</h1>
            <p className="text-muted-foreground">
              Point your camera at the CDE's QR code
            </p>
          </div>

          <div
            id="qr-reader"
            className="rounded-lg overflow-hidden border-4 border-primary shadow-lg"
            style={{ width: "100%" }}
          />

          {isScanning && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                Scanning...
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scanner;