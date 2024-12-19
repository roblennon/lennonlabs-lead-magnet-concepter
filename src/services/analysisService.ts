import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/components/RevenueForm";

export const generateAnalysis = async (data: FormData) => {
  // Save analysis to database
  const { data: savedAnalysis, error: dbError } = await supabase
    .from('revenue_analyses')
    .insert({
      email: data.email,
      offer: data.offer,
      help_requests: "lead_magnet_generation",
      revenue_source: "not_applicable",
    })
    .select()
    .single();

  if (dbError) throw dbError;

  // Get AI configuration
  const { data: aiConfig, error: configError } = await supabase
    .from('ai_configs')
    .select()
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (configError) throw configError;

  // Generate analysis
  const response = await supabase.functions.invoke('analyze-revenue', {
    body: { 
      analysisId: savedAnalysis.id,
      prompt: aiConfig.prompt,
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      data
    }
  });

  if (response.error) throw response.error;

  return response.data;
};