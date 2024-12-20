import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";

type AdminFormFieldsProps = {
  form: UseFormReturn<PageConfig>;
};

export const AdminFormFields = ({ form }: AdminFormFieldsProps) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="sales_image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Image URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cta_heading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CTA Heading</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cta_body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CTA Body</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cta_button_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CTA Button Text</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};