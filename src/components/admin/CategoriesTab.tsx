import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CategoryDialog from "./CategoryDialog";
import CategoryList from "./CategoryList";

const CategoriesTab = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      if (error.code === "23503") {
        toast.error("Cannot delete category: refrigerators are using it");
      } else {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoriesTab;