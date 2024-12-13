export interface FormField {
  type: 'email' | 'textarea' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface FormFields {
  [key: string]: FormField;
}

export interface ButtonConfig {
  text: string;
  icon: string;
  loadingText: string;
}

export interface FormConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  fields: FormFields;
  buttonConfig: ButtonConfig;
  promptId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RevenueAnalysis {
  id: string;
  email: string;
  offer: string;
  revenueSource: string;
  helpRequests: string;
  analysis?: string;
  promptId?: string;
  createdAt?: string;
}