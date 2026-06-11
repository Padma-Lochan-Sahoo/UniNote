import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center px-4", className)}>
      <div className="w-16 h-16 bg-muted border border-border rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground text-base mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs font-mono">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
