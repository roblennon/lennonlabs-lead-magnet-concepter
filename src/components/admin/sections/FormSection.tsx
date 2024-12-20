import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";

type FormSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const FormSection = ({ form }: FormSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Form Configuration</h3>
      <FormField
        control={form.control}
        name="cta_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form CTA Text</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deliverable_empty_state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deliverable Empty State</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};