import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";

type HeaderSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const HeaderSection = ({ form }: HeaderSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Header Configuration</h3>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Page Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Page Subtitle</FormLabel>
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