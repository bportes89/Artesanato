import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export function PageHeader({ eyebrow, title, description, action, className }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}><div className="space-y-3">{eyebrow ? <Badge>{eyebrow}</Badge> : null}<div className="space-y-1"><h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h1>{description ? <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p> : null}</div></div>{action ? <div>{action}</div> : null}</div>;
}

