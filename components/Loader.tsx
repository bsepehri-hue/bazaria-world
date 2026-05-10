import { Loader2 } from "lucide-react";

export default function Loader(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Loader2
      {...props}
      className={`w-8 h-8 animate-spin mx-auto mb-3 text-teal-600 ${props.className ?? ""}`}
    />
  );
}