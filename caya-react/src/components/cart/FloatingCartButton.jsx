import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";

export function FloatingCartButton({ count, onOpen }) {
  return (
    <Button
      className="glass-button fixed bottom-28 right-4 z-40 gap-3 rounded-[28px] border border-white/15 px-5 py-6 shadow-[0_20px_46px_rgba(123,44,191,0.3),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[24px] md:bottom-6 md:right-6"
      onClick={onOpen}
      type="button"
    >
      <ShoppingBag className="h-5 w-5" />
      <span>Cart</span>
      <Badge className="bg-white/72 text-foreground shadow-[0_8px_20px_rgba(61,23,79,0.12)]" variant="secondary">
        {count}
      </Badge>
    </Button>
  );
}
