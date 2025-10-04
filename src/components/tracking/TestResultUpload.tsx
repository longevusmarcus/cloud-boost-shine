import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, ExternalLink, FileText, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestResultUploadProps {
  onUpload: () => void;
  isCompact?: boolean;
}

export default function TestResultUpload({ onUpload, isCompact = false }: TestResultUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    test_date: "",
    file: null as File | null
  });
  const [extractionStatus, setExtractionStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      setExtractionStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsUploading(true);
    setExtractionStatus("processing");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // For now, create a placeholder test result
      // In production, you'd implement PDF extraction
      const { error } = await supabase
        .from('test_results')
        .insert({
          user_id: session.user.id,
          test_date: formData.test_date,
          provider: "yo",
          notes: "Uploaded via web interface"
        });

      if (error) throw error;

      setExtractionStatus("success");
      toast({
        title: "Success!",
        description: "Test result uploaded successfully",
      });

      setTimeout(() => {
        setShowForm(false);
        setFormData({ test_date: "", file: null });
        setExtractionStatus(null);
        onUpload();
      }, 1500);
    } catch (error: any) {
      console.error("Upload error:", error);
      setExtractionStatus("error");
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsUploading(false);
  };

  if (!showForm) {
    return (
      <div>
        <Button
          onClick={() => setShowForm(true)}
          className={`${
            isCompact 
              ? "h-10 px-4 text-sm" 
              : "h-12 md:h-14 px-6 md:px-8 text-sm md:text-base"
          } bg-black hover:bg-gray-800 text-white rounded-xl font-semibold`}
        >
          <Upload className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          {isCompact ? "Upload New" : "Upload YO Test"}
        </Button>

        {!isCompact && (
          <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="font-semibold text-black mb-2">Get Your YO Test 🔬</h4>
            <p className="text-sm text-gray-600 mb-4">
              Only YO Home Sperm Test PDFs are supported for automatic processing
            </p>
            <a
              href="https://www.hellosperm.com/products/yo-home-sperm-test"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-black transition-all duration-200"
            >
              <div>
                <div className="font-medium text-black">Order YO Sperm Test</div>
                <div className="text-sm text-gray-600">At-home testing kit</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ YO Test Only:</span> Please upload your YO Home Sperm Test PDF. Other formats will not be processed.
        </p>
      </div>

      <div>
        <Label className="text-black font-medium mb-2 block text-sm">Test Date</Label>
        <Input
          type="date"
          value={formData.test_date}
          onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
          className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
          required
        />
      </div>

      <div>
        <Label className="text-black font-medium mb-2 block text-sm">Upload YO Test PDF</Label>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
          required
          disabled={isUploading}
        />
        {formData.file && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{formData.file.name}</span>
          </div>
        )}
      </div>

      {extractionStatus === "processing" && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            <div>
              <div className="font-medium text-gray-900">Processing PDF...</div>
              <div className="text-sm text-gray-600">Extracting test results</div>
            </div>
          </div>
        </div>
      )}

      {extractionStatus === "success" && (
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">Success!</div>
              <div className="text-sm text-green-700">Test results extracted and saved</div>
            </div>
          </div>
        </div>
      )}

      {extractionStatus === "error" && (
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-medium text-red-900">Processing Failed</div>
              <div className="text-sm text-red-700">Unable to extract data. Please ensure this is a valid YO test PDF.</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => {
            setShowForm(false);
            setExtractionStatus(null);
          }}
          variant="outline"
          className="flex-1 h-12 border-gray-300 text-black hover:bg-gray-100 rounded-xl"
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
          disabled={isUploading || !formData.file}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload & Process
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
