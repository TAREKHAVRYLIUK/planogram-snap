import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import RefrigeratorDialog from "./RefrigeratorDialog";
import RefrigeratorList from "./RefrigeratorList";

const RefrigeratorsTab = () => {
  const [refrigerators, setRefrigerators] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFridge, setEditingFridge] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fridgesRes, catsRes] = await Promise.all([
        supabase.from("refrigerators").select(`
          *,
          categories (name)
        `).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (fridgesRes.error) throw fridgesRes.error;
      if (catsRes.error) throw catsRes.error;

      setRefrigerators(fridgesRes.data || []);
      setCategories(catsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fridge: any) => {
    setEditingFridge(fridge);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this refrigerator?")) return;

    try {
      const { error } = await supabase
        .from("refrigerators")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Refrigerator deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting refrigerator:", error);
      toast.error("Failed to delete refrigerator");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingFridge(null);
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Refrigerators</h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Refrigerator
        </Button>
      </div>

      <RefrigeratorList
        refrigerators={refrigerators}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <RefrigeratorDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        categories={categories}
        editingFridge={editingFridge}
      />
    </div>
  );
};

export default RefrigeratorsTab;