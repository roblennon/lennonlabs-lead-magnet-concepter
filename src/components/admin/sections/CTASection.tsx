import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";

type CTASectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const CTASection = ({ form }: CTASectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Call-to-Action Configuration</h3>
      <FormField
        control={form.control}
        name="cta_heading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CTA Heading</FormLabel>
            <FormControl>
              <Textarea 
                className="resize-y min-h-[60px]" 
                {...field} 
              />
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
              <Textarea 
                className="resize-y min-h-[180px]" 
                {...field} 
              />
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
              <Textarea 
                className="resize-y min-h-[60px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cta_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CTA URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};