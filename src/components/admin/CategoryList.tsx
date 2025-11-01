import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryListProps {
  categories: any[];
  loading: boolean;
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}

const CategoryList = ({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryListProps) => {
  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="p-12">
        <p className="text-center text-muted-foreground">
          No categories added yet. Click "Add Category" to create one.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Planogram Preview</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <img
                  src={category.planogram_url}
                  alt={category.name}
                  className="h-16 w-24 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CategoryList;