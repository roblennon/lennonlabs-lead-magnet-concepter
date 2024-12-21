import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ConvertKitSectionProps = {
  form: UseFormReturn<PageConfig>;
};

export const ConvertKitSection = ({ form }: ConvertKitSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">ConvertKit Integration</h3>
        <p className="text-sm text-muted-foreground">
          Configure your ConvertKit form settings
        </p>
      </div>

      <FormField
        control={form.control}
        name="convertkit_form_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter your ConvertKit form ID" {...field} />
            </FormControl>
            <FormDescription>
              The ID of your ConvertKit form for email collection
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="convertkit_fields"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Fields</FormLabel>
            <FormControl>
              <Textarea
                placeholder='{"field_name": "value"}'
                className="min-h-[150px] font-mono"
                {...field}
                value={typeof field.value === 'string' 
                  ? field.value 
                  : JSON.stringify(field.value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    field.onChange(parsed);
                  } catch (error) {
                    // Allow invalid JSON while typing
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Custom fields to send to ConvertKit (in JSON format)
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};