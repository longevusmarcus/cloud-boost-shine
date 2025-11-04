import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export const DisclaimerModal = ({ open, onAccept }: DisclaimerModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 bg-white dark:bg-gray-900 border-none overflow-hidden">
        {/* Sperm with Speech Bubble Container */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          {/* Floating Sperm Icon */}
          <div className="text-4xl mb-3 animate-bounce">💧</div>
          
          {/* Speech Bubble */}
          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-full p-5 shadow-sm max-w-[280px]">
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gray-50 dark:border-b-gray-800"></div>
            
            <div className="text-center space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Disclaimer
              </h2>
              
              <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal space-y-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}>
                <p>
                  Status is in Beta. The sperm valuation algorithm is experimental and under active development.
                </p>
                <p>
                  This app does not provide financial, medical, or professional advice. For educational and entertainment purposes only.
                </p>
                <p>
                  Don't store more data than needed. By using the app you assume full responsibility for all risks concerning your data and decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OK Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onAccept}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm py-2"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
