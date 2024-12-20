import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { HeaderSection } from "./sections/HeaderSection";
import { FormSection } from "./sections/FormSection";
import { SalesSection } from "./sections/SalesSection";
import { CTASection } from "./sections/CTASection";

type AdminFormProps = {
  form: UseFormReturn<PageConfig>;
  onSubmit: (values: PageConfig) => void;
};

export const AdminForm = ({ form, onSubmit }: AdminFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <HeaderSection form={form} />
            <FormSection form={form} />
          </div>
          <div className="space-y-8">
            <SalesSection form={form} />
            <CTASection form={form} />
          </div>
        </div>
      </form>
    </Form>
  );
};