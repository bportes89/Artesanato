import { Skeleton } from "@/components/ui/skeleton";
export default function MembersLoading() { return <div className="space-y-6"><Skeleton className="h-24 w-full rounded-[28px]" /><div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-40 rounded-[28px]" /><Skeleton className="h-40 rounded-[28px]" /><Skeleton className="h-40 rounded-[28px]" /></div><Skeleton className="h-80 rounded-[28px]" /></div>; }

