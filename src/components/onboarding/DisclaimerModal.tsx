import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export const DisclaimerModal = ({ open, onAccept }: DisclaimerModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white dark:bg-gray-900 border-none overflow-hidden">
        {/* Sperm with Speech Bubble Container */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          {/* Sperm Icon */}
          <div className="text-6xl mb-4">🏊</div>
          
          {/* Speech Bubble */}
          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
            {/* Speech bubble pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-gray-50 dark:border-b-gray-800"></div>
            
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Disclaimer
              </h2>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-normal space-y-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}>
                <p>
                  Status is in Beta and continuously improving. The sperm valuation algorithm is experimental and under active development.
                </p>
                <p>
                  This app does not provide financial, medical, or professional advice. All information is for educational and entertainment purposes only.
                </p>
                <p>
                  Don't store more data than you need for testing. Only share data with people you trust. By using the app you assume full responsibility for all risks concerning your data and any decisions made.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OK Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onAccept}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
