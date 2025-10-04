import { format } from "date-fns";
import { TrendingUp, Users, Shapes, Droplets, ExternalLink, Activity, Zap, Target } from "lucide-react";

interface TestResult {
  test_date: string;
  provider: string;
  concentration?: number;
  motility?: number;
  progressive_motility?: number;
  motile_sperm_concentration?: number;
  progressive_motile_sperm_concentration?: number;
  morphology?: number;
  volume?: number;
  file_url?: string;
}

interface TestResultDisplayProps {
  result: TestResult;
}

export default function TestResultDisplay({ result }: TestResultDisplayProps) {
  const getStatus = (value: number | undefined, normalMin: number, lowThreshold: number | null = null) => {
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

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Test Results</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {format(new Date(result.test_date), "MMM d, yyyy")}
          </h3>
          <p className="text-gray-600 text-sm capitalize">Via {result.provider}</p>
        </div>
        {result.file_url && (
          <a
            href={result.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl transition-all duration-200 text-sm font-medium"
          >
            PDF
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Primary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {result.concentration && (
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Concentration</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {result.concentration}
              <span className="text-lg text-gray-600 ml-1">M/ml</span>
            </div>
            <div className={`text-sm font-medium ${concentrationStatus.color}`}>
              {concentrationStatus.text}
            </div>
          </div>
        )}

        {result.motility && (
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Motility</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {result.motility}
              <span className="text-lg text-gray-600 ml-1">%</span>
            </div>
            <div className={`text-sm font-medium ${motilityStatus.color}`}>
              {motilityStatus.text}
            </div>
          </div>
        )}

        {result.morphology && (
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <Shapes className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wide">Morphology</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {result.morphology}
              <span className="text-lg text-gray-600 ml-1">%</span>
            </div>
            <div className={`text-sm font-medium ${morphologyStatus.color}`}>
              {morphologyStatus.text}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Metrics */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Advanced Metrics</h4>
        
        {result.progressive_motility && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Progressive Motility</div>
                  <div className="text-2xl font-bold text-gray-900">{result.progressive_motility}%</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${progressiveMotilityStatus.color}`}>
                {progressiveMotilityStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.motile_sperm_concentration && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Motile Sperm Concentration (MSC)</div>
                  <div className="text-2xl font-bold text-gray-900">{result.motile_sperm_concentration} M/ml</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${mscStatus.color}`}>
                {mscStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.progressive_motile_sperm_concentration && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Progressive MSC (PMSC)</div>
                  <div className="text-2xl font-bold text-gray-900">{result.progressive_motile_sperm_concentration} M/ml</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${pmscStatus.color}`}>
                {pmscStatus.text}
              </div>
            </div>
          </div>
        )}

        {result.volume && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Droplets className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Sample Volume</div>
                <div className="text-2xl font-bold text-gray-900">{result.volume} ml</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WHO Reference Info */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ WHO 6th Edition Reference:</span> These results are compared against World Health Organization standards for optimal fertility parameters.
        </p>
      </div>
    </div>
  );
}
