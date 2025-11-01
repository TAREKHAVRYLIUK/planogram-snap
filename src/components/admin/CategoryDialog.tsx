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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  editingCategory: any;
}

const CategoryDialog = ({
  open,
  onClose,
  editingCategory,
}: CategoryDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [planogramUrl, setPlanogramUrl] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setPlanogramUrl(editingCategory.planogram_url);
    } else {
      setName("");
      setPlanogramUrl("");
    }
  }, [editingCategory, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name,
            planogram_url: planogramUrl,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase.from("categories").insert({
          name,
          planogram_url: planogramUrl,
        });

        if (error) throw error;
        toast.success("Category added successfully");
      }

      onClose();
    } catch (error: any) {
      console.error("Error saving category:", error);
      if (error.code === "23505") {
        toast.error("Category name already exists");
      } else {
        toast.error("Failed to save category");
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
            {editingCategory ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Supermarket"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Planogram Image URL</Label>
            <Input
              id="url"
              type="url"
              value={planogramUrl}
              onChange={(e) => setPlanogramUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              required
              disabled={loading}
            />
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

export default CategoryDialog;