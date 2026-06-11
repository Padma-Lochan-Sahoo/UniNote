import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Crumb { label: string; to?: string }
interface Props {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  badge?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, crumbs, actions, badge, className }: Props) {
  return (
    <div className={cn("mb-8", className)}>
      {crumbs && crumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-3 flex-wrap font-mono">
          <Link to="/" className="hover:text-accent transition-colors">
            <Home className="w-3 h-3" />
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 opacity-40" />
              {c.to ? (
                <Link to={c.to} className="hover:text-accent transition-colors capitalize">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground/80 capitalize">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight capitalize">
              {title}
            </h1>
            {badge && (
              <span className="label-mono px-2 py-0.5 bg-accent/10 text-accent rounded border border-accent/20">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 font-mono">{subtitle}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
