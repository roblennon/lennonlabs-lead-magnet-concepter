import { Button } from "@/components/ui/button";

type AdminHeaderProps = {
  isLoading: boolean;
  onSubmit: () => void;
};

export const AdminHeader = ({ isLoading, onSubmit }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Revenue Analyzer Configuration</h1>
      <Button type="submit" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};