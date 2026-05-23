"use client";
import { Button } from "@/components/ui/button";
export default function MembersError({ reset }: { reset: () => void }) { return <div className="premium-surface rounded-[32px] p-8 text-center"><h2 className="font-serif text-3xl">Algo saiu do fluxo</h2><p className="mt-3 text-muted-foreground">Não foi possível carregar esta área agora.</p><Button className="mt-6" onClick={() => reset()}>Tentar novamente</Button></div>; }

