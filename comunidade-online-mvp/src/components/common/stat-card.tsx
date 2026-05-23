import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function StatCard({ label, value, helper }: { label: string; value: React.ReactNode; helper?: string }) {
  return <Card><CardHeader className="pb-3"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p><CardTitle className="text-3xl">{value}</CardTitle></CardHeader>{helper ? <CardContent><p className="text-sm text-muted-foreground">{helper}</p></CardContent> : null}</Card>;
}

