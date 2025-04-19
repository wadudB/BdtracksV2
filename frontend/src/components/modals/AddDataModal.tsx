import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { Commodity } from "@/types";
import { toast } from "sonner";
import { useCreatePriceRecord, useGetCommodityDropdown, useGetRegions } from "@/hooks/useQueries";

interface AddDataModalProps {
  trigger: React.ReactNode;
  commodity?: Commodity;
  onSuccess?: () => void;
}

// Type for dropdown commodities
interface CommodityDropdownItem {
  id: number;
  name: string;
  bengaliName?: string;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ trigger, commodity, onSuccess }) => {
  // State for price record form
  const [priceForm, setPriceForm] = useState({
    commodityId: commodity?.id ? commodity.id.toString() : "",
    regionId: "",
    price: "",
    source: "Market Survey",
    notes: "",
    recordedAt: new Date().toISOString().split("T")[0],
  });

  const [open, setOpen] = useState<boolean>(false);

  // Use React Query hooks
  const { data: commodities = [], isLoading: isLoadingCommodities } = useGetCommodityDropdown();

  const { data: regions = [], isLoading: isLoadingRegions } = useGetRegions();

  const { mutate: createPriceRecord, isPending: isSubmitting } = useCreatePriceRecord();

  // Determine if data is still loading
  const isLoading = isLoadingCommodities || isLoadingRegions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!priceForm.commodityId || !priceForm.regionId || !priceForm.price) {
      console.error("All fields are required");
      return;
    }

    // Create price record using the mutation
    createPriceRecord(
      {
        commodity_id: parseInt(priceForm.commodityId),
        region_id: parseInt(priceForm.regionId),
        price: parseFloat(priceForm.price),
        source: priceForm.source,
        notes: priceForm.notes,
        recorded_at: priceForm.recordedAt,
      },
      {
        onSuccess: () => {
          // Get the selected commodity name for the success message
          const selectedCommodity = commodities.find(
            (c: CommodityDropdownItem) => c.id.toString() === priceForm.commodityId
          );
          const commodityName = selectedCommodity ? selectedCommodity.name : priceForm.commodityId;

          toast.success(`Added price record: ৳${priceForm.price} for ${commodityName}`);

          // Close modal and reset form after successful submission
          setOpen(false);
          setPriceForm({
            ...priceForm,
            regionId: "",
            price: "",
            notes: "",
          });

          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Price Record</DialogTitle>
          <DialogDescription>
            {commodity
              ? `Enter new price information for ${commodity.name}`
              : "Enter new price information for a commodity"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity</Label>
                {commodity ? (
                  <Input id="commodity" value={commodity.name} disabled />
                ) : (
                  <Select
                    required
                    value={priceForm.commodityId}
                    onValueChange={(value) => setPriceForm({ ...priceForm, commodityId: value })}
                  >
                    <SelectTrigger id="commodity">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map((commodity: CommodityDropdownItem) => (
                        <SelectItem key={commodity.id} value={commodity.id.toString()}>
                          {commodity.name}{" "}
                          {commodity.bengaliName ? `(${commodity.bengaliName})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  required
                  value={priceForm.regionId}
                  onValueChange={(value) => setPriceForm({ ...priceForm, regionId: value })}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem
                        key={typeof region.id === "number" ? region.id : region.id.toString()}
                        value={typeof region.id === "number" ? region.id.toString() : region.id}
                      >
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input
                  id="price"
                  required
                  type="number"
                  value={priceForm.price}
                  onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordedAt">Date Recorded</Label>
                <Input
                  id="recordedAt"
                  required
                  type="date"
                  value={priceForm.recordedAt}
                  onChange={(e) => setPriceForm({ ...priceForm, recordedAt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={priceForm.source}
                onChange={(e) => setPriceForm({ ...priceForm, source: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={priceForm.notes}
                onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Price Record"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddDataModal;
