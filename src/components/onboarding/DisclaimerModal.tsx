import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export const DisclaimerModal = ({ open, onAccept }: DisclaimerModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm p-6 gap-4 bg-card border">
        {/* Floating Sperm Icon */}
        <div className="flex justify-center mb-2">
          <div className="text-4xl animate-bounce">💧</div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-foreground">
            Disclaimer
          </h2>
          
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' }}>
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

        <Button
          onClick={onAccept}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          I Understand
        </Button>
      </DialogContent>
    </Dialog>
  );
};
