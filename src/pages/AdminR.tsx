import { useEffect } from "react";
import { useAdminConfig } from "@/hooks/useAdminConfig";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminForm } from "@/components/admin/AdminForm";

const AdminR = () => {
  const { form, isLoading, fetchConfig, handleSubmit } = useAdminConfig();

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader isLoading={isLoading} onSubmit={form.handleSubmit(handleSubmit)} />
      <AdminForm form={form} onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminR;