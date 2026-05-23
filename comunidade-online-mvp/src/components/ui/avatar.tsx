import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, initials } from "@/lib/utils";
export function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) { return <AvatarPrimitive.Root className={cn("relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-secondary", className)} {...props} />; }
export function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) { return <AvatarPrimitive.Image className={cn("aspect-square h-full w-full", className)} {...props} />; }
export function AvatarFallback({ className, name, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { name?: string | null }) { return <AvatarPrimitive.Fallback className={cn("flex h-full w-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary", className)} {...props}>{initials(name)}</AvatarPrimitive.Fallback>; }

