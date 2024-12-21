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

const defaultConvertKitFields = {
  lead_magnet: "5-min rapid results lead magnet",
  lead_magnet_link: "{{deliverable_link}}"
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
        render={({ field }) => {
          // Initialize with default fields if empty
          const currentValue = field.value && Object.keys(field.value).length > 0 
            ? field.value 
            : defaultConvertKitFields;

          return (
            <FormItem>
              <FormLabel>Custom Fields</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{"lead_magnet": "5-min rapid results lead magnet", "lead_magnet_link": "{{deliverable_link}}"}'
                  className="min-h-[150px] font-mono"
                  value={typeof currentValue === 'string' 
                    ? currentValue 
                    : JSON.stringify(currentValue, null, 2)}
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
                Custom fields to send to ConvertKit (in JSON format). The lead_magnet_link will be automatically populated with the generated PDF link.
              </FormDescription>
            </FormItem>
          );
        }}
      />
    </div>
  );
};