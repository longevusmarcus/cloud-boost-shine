import { format } from "date-fns";
import { TrendingUp, Users, Shapes, Droplets, ExternalLink, Activity, Zap, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  test_date: string;
  provider: string;
  concentration?: number | null;
  motility?: number | null;
  progressive_motility?: number | null;
  motile_sperm_concentration?: number | null;
  progressive_motile_sperm_concentration?: number | null;
  morphology?: number | null;
  volume?: number | null;
  file_url?: string | null;
  notes?: string | null;
}

interface TestResultDisplayProps {
  result: TestResult;
  onDelete?: () => void;
}

export default function TestResultDisplay({ result, onDelete }: TestResultDisplayProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this test result?')) return;

    try {
      const { error } = await supabase
        .from('test_results')
        .delete()
        .eq('id', result.id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Test result removed successfully",
      });

      onDelete?.();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete test result",
        variant: "destructive",
      });
    }
  };
  const getStatus = (value: number | null | undefined, normalMin: number, lowThreshold: number | null = null) => {
    if (!value) return { text: "N/A", color: "text-gray-600" };
    if (value >= normalMin) return { text: "Normal ✓", color: "text-green-600" };
    if (lowThreshold && value >= lowThreshold) return { text: "Below optimal", color: "text-yellow-600" };
    return { text: "Low", color: "text-red-600" };
  };

  const concentrationStatus = getStatus(result.concentration, 16, 10);
  const motilityStatus = getStatus(result.motility, 42, 30);
  const progressiveMotilityStatus = getStatus(result.progressive_motility, 30, 20);
  const mscStatus = getStatus(result.motile_sperm_concentration, 7, 4);
  const pmscStatus = getStatus(result.progressive_motile_sperm_concentration, 5, 3);
  const morphologyStatus = getStatus(result.morphology, 4, 2);

  const hasAnyMetrics = result.concentration || result.motility || result.morphology || 
                        result.progressive_motility || result.motile_sperm_concentration || 
                        result.progressive_motile_sperm_concentration || result.volume;

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Test Results</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(new Date(result.test_date), "MMM d, yyyy")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm capitalize">Via {result.provider}</p>
        </div>
        <div className="flex items-center gap-2">
          {result.file_url && (
            <a
              href={result.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl transition-all duration-200 text-sm font-medium"
            >
              PDF
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="h-10 px-4 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 rounded-2xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* No Metrics Message */}
      {!hasAnyMetrics && (
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">No Metrics Available</h4>
              <p className="text-sm text-amber-800">
                This test result was uploaded without metric values. You can edit it from the Tracking page to add concentration, motility, morphology, and other measurements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Stats */}
      {hasAnyMetrics && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {result.concentration && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Concentration</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {result.concentration}
              <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">M/ml</span>
            </div>
            <div className={`text-sm font-medium ${concentrationStatus.color}`}>
              {concentrationStatus.text}
            </div>
          </div>
        )}

        {result.motility && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Motility</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {result.motility}
              <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">%</span>
            </div>
            <div className={`text-sm font-medium ${motilityStatus.color}`}>
              {motilityStatus.text}
            </div>
          </div>
        )}

        {result.morphology && (
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
              <Shapes className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Morphology</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {result.morphology}
              <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">%</span>
            </div>
            <div className={`text-sm font-medium ${morphologyStatus.color}`}>
              {morphologyStatus.text}
            </div>
          </div>
          )}
        </div>
      )}

      {/* Advanced Metrics */}
      {hasAnyMetrics && (
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Advanced Metrics</h4>
        
        {result.progressive_motility && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Progressive Motility</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.progressive_motility}%</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${progressiveMotilityStatus.color}`}>
                {progressiveMotilityStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.motile_sperm_concentration && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Motile Sperm Concentration (MSC)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.motile_sperm_concentration} M/ml</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${mscStatus.color}`}>
                {mscStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.progressive_motile_sperm_concentration && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Progressive MSC (PMSC)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.progressive_motile_sperm_concentration} M/ml</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${pmscStatus.color}`}>
                {pmscStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.volume && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Sample Volume</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.volume} ml</div>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* WHO Reference Info */}
      {hasAnyMetrics && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ WHO 6th Edition Reference:</span> These results are compared against World Health Organization standards for optimal fertility parameters.
        </p>
        </div>
      )}

      {/* Notes */}
      {result.notes && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{result.notes}</p>
        </div>
      )}
    </div>
  );
}
