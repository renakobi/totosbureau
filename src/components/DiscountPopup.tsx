import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Gift, Sparkles } from "lucide-react";

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Show popup after 8 seconds if user hasn't seen it
    const hasSeenDiscount = localStorage.getItem("totos-bureau-discount-seen");
    if (!hasSeenDiscount) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store that user has seen the discount
      localStorage.setItem("totos-bureau-discount-seen", "true");
      setIsOpen(false);
      // Show success message
      alert(`Thank you! Your discount code TOTO15 has been sent to ${email}`);
    }
  };

  const handleClose = () => {
    localStorage.setItem("totos-bureau-discount-seen", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-strong">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              <Sparkles className="h-3 w-3 mr-1" />
              Special Mission
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white mt-4">
            🐾 Welcome to Toto's Bureau!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2 text-white">15% OFF</div>
            <p className="text-white/90">Your first mission box</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20"
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="w-full bg-white text-orange-600 hover:bg-white/90 shadow-soft"
              size="lg"
            >
              <Gift className="h-4 w-4 mr-2" />
              Accept Mission
            </Button>
          </form>
          
          <p className="text-xs text-white/70 mt-4">
            * Valid for new customers only. Code expires in 7 days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;