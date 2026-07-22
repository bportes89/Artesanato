import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WaitlistCta } from "@/components/members/waitlist-cta";
import { TeacherApplicationForm } from "@/components/members/teacher-application-form";
import { type WaitlistTopic } from "@/lib/member-area";

type ComingSoonSectionProps = {
  title: string;
  description: string;
  topic: WaitlistTopic;
  buttonLabel: string;
  teaserLabel?: string;
  secondaryTitle?: string;
  showTeacherForm?: boolean;
};

export function ComingSoonSection({
  title,
  description,
  topic,
  buttonLabel,
  teaserLabel = "Em breve",
  secondaryTitle,
  showTeacherForm = false,
}: ComingSoonSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-[#F5A623]/30 bg-[#F1E8DC]">
        <div className="h-52 bg-[linear-gradient(135deg,rgba(212,84,42,0.14),rgba(245,166,35,0.2))]" />
        <CardHeader className="gap-4">
          <span className="w-fit rounded-full bg-[#F5A623]/20 px-4 py-2 text-sm font-semibold text-[#1B2A3B]">{teaserLabel}</span>
          <CardTitle className="font-display text-3xl text-[#1B2A3B] md:text-4xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base leading-8 text-[#1B2A3B]">{description}</p>
          <WaitlistCta topic={topic} buttonLabel={buttonLabel} className="max-w-md" />
        </CardContent>
      </Card>

      {showTeacherForm ? (
        <Card className="border border-[#D4542A]/15 bg-white/80">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1B2A3B]">
              {secondaryTitle ?? "Você é artesã e domina uma técnica tradicional?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-8 text-[#1B2A3B]">
              Compartilhe sua trajetória e sua técnica. As respostas chegam direto para a Fernanda no painel Admin.
            </p>
            <TeacherApplicationForm />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
