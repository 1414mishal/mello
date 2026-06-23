import AuroraHeroBase from "@/components/ui/digital-aurora";

type CtaButton = { text: string; href: string; primary?: boolean };
type AuroraHeroProps = {
  title: string;
  description: string;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: CtaButton[];
  microDetails?: string[];
};
const AuroraHero = AuroraHeroBase as React.FC<AuroraHeroProps>;

export function CTA() {
  return (
    <section id="contact" className="relative w-full overflow-hidden">
      <AuroraHero
        title="Ready to build your next big idea?"
        description="Tell us what you're working on. We'll help you design, build, and ship it — from first sketch to launch and beyond."
        badgeText="Usually replies within a day"
        badgeLabel="Let's talk"
        ctaButtons={[
          { text: "Contact us", href: "mailto:hello@melloagnc.com", primary: true },
          { text: "Book a call", href: "#" },
        ]}
        microDetails={[
          "Fixed-scope or ongoing",
          "Senior team, no hand-offs",
          "Transparent pricing",
        ]}
      />
    </section>
  );
}
