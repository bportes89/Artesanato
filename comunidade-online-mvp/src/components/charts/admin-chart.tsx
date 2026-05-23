"use client";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type BarDatum = { name: string; value: number };
type LineDatum = { date: string; value: number };
export function AdminChart(props: { title?: string; variant?: "bar" | "line"; data: BarDatum[] | LineDatum[] }) {
  const title = props.title ?? "Panorama operacional";
  const variant = props.variant ?? "bar";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "line" ? (
            <LineChart data={props.data as LineDatum[]}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "hsl(var(--primary) / 0.08)" }} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={props.data as BarDatum[]}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "hsl(var(--primary) / 0.08)" }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
