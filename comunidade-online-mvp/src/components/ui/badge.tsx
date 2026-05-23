import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", { variants: { variant: { default: "bg-primary/10 text-primary", secondary: "bg-secondary text-secondary-foreground", outline: "border border-border text-muted-foreground", accent: "bg-accent/15 text-accent" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) { return <div className={cn(badgeVariants({ variant }), className)} {...props} />; }

