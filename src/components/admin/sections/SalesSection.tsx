import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { ImageUploadField } from "../ImageUploadField";

type SalesSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const SalesSection = ({ form }: SalesSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sales Content Configuration</h3>
      <FormField
        control={form.control}
        name="sales_heading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Heading</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sales_intro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Intro</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sales_benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Benefits (comma-separated)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value?.join(", ")} 
                onChange={(e) => {
                  const benefitsArray = e.target.value
                    .split(",")
                    .map(benefit => benefit.trim())
                    .filter(benefit => benefit !== "");
                  field.onChange(benefitsArray);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sales_closing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Closing</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ImageUploadField form={form} />
    </div>
  );
};