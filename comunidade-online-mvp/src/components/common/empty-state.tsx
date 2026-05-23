import { Card, CardContent } from "@/components/ui/card";
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <Card className="border-dashed"><CardContent className="flex min-h-52 flex-col items-center justify-center gap-4 text-center"><div className="space-y-2"><h3 className="text-xl font-semibold">{title}</h3><p className="max-w-md text-sm text-muted-foreground">{description}</p></div>{action}</CardContent></Card>;
}

