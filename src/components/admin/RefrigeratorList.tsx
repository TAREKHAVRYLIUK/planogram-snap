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

interface RefrigeratorListProps {
  refrigerators: any[];
  loading: boolean;
  onEdit: (fridge: any) => void;
  onDelete: (id: string) => void;
}

const RefrigeratorList = ({
  refrigerators,
  loading,
  onEdit,
  onDelete,
}: RefrigeratorListProps) => {
  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (refrigerators.length === 0) {
    return (
      <Card className="p-12">
        <p className="text-center text-muted-foreground">
          No refrigerators added yet. Click "Add Refrigerator" to create one.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial Number</TableHead>
            <TableHead>Store Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {refrigerators.map((fridge) => (
            <TableRow key={fridge.id}>
              <TableCell className="font-mono text-sm">
                {fridge.serial_number}
              </TableCell>
              <TableCell>{fridge.store_name}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {fridge.categories?.name}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(fridge)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(fridge.id)}
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

export default RefrigeratorList;