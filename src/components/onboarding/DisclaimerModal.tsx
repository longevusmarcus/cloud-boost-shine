import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export const DisclaimerModal = ({ open, onAccept }: DisclaimerModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[300px] p-0 gap-0 bg-white dark:bg-gray-900 border-none rounded-2xl overflow-hidden shadow-lg">
        <div className="pt-6 pb-4 px-6 space-y-3">
          <h2 className="text-[17px] font-semibold text-center text-gray-900 dark:text-gray-100" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}>
            Disclaimer
          </h2>
          
          <p className="text-[13px] text-gray-900 dark:text-gray-100 text-center leading-[18px]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}>
            Status is in Beta. The sperm valuation algorithm is experimental and under active development. This app does not provide financial, medical, or professional advice. For educational and entertainment purposes only. Don't store more data than needed. By using the app you assume full responsibility for all risks concerning your data and decisions.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAccept}
            className="w-full py-3 text-[17px] font-semibold text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
