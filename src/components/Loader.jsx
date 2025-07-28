import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 24 }) {
  return <Loader2 className="text-white animate-spin" size={size} />;
}
