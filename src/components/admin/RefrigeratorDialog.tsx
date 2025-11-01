import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RefrigeratorDialogProps {
  open: boolean;
  onClose: () => void;
  categories: any[];
  editingFridge: any;
}

const RefrigeratorDialog = ({
  open,
  onClose,
  categories,
  editingFridge,
}: RefrigeratorDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (editingFridge) {
      setSerialNumber(editingFridge.serial_number);
      setStoreName(editingFridge.store_name);
      setCategoryId(editingFridge.category_id);
    } else {
      setSerialNumber("");
      setStoreName("");
      setCategoryId("");
    }
  }, [editingFridge, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFridge) {
        const { error } = await supabase
          .from("refrigerators")
          .update({
            serial_number: serialNumber,
            store_name: storeName,
            category_id: categoryId,
          })
          .eq("id", editingFridge.id);

        if (error) throw error;
        toast.success("Refrigerator updated successfully");
      } else {
        const { error } = await supabase.from("refrigerators").insert({
          serial_number: serialNumber,
          store_name: storeName,
          category_id: categoryId,
        });

        if (error) throw error;
        toast.success("Refrigerator added successfully");
      }

      onClose();
    } catch (error: any) {
      console.error("Error saving refrigerator:", error);
      if (error.code === "23505") {
        toast.error("Serial number already exists");
      } else {
        toast.error("Failed to save refrigerator");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingFridge ? "Edit Refrigerator" : "Add Refrigerator"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serial">Serial Number</Label>
            <Input
              id="serial"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="FR123456789"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store">Store Name</Label>
            <Input
              id="store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Kiosk №24"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              required
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefrigeratorDialog;