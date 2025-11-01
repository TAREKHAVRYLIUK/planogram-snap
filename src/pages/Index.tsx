import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6">
              <QrCode className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Planogram Viewer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scan CDE QR codes to instantly view the correct product layout for any store category
            </p>
          </div>

          {/* Main Action Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Get Started</h2>
                <p className="text-muted-foreground">
                  Tap the button below to scan a CDE QR code
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate("/scanner")}
                className="w-full max-w-md h-14 text-lg gap-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                <QrCode className="h-6 w-6" />
                Scan QR Code
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Quick Scanning</h3>
              <p className="text-sm text-muted-foreground">
                Fast and accurate QR code detection
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Category-Based</h3>
              <p className="text-sm text-muted-foreground">
                Displays planograms based on store type
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Always Updated</h3>
              <p className="text-sm text-muted-foreground">
                Latest planogram images from admin
              </p>
            </div>
          </div>

          {/* Admin Link
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate("/admin")}
              className="text-muted-foreground hover:text-foreground"
            >
              Admin Login
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
