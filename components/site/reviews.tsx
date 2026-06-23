import { Star } from "lucide-react";
import { BlueShader } from "@/components/ui/blue-shader";

const REVIEWS = [
  {
    quote:
      "mello transformed our outdated website into a modern, responsive platform. Their attention to detail and ability to understand our vision made the entire process smooth and hassle-free.",
    name: "Michael Johnson",
    role: "Marketing Manager, GlobalTech Solutions",
  },
  {
    quote:
      "Working with mello felt like having an in-house team. They shipped fast, communicated clearly, and the final product exceeded what we imagined.",
    name: "Sarah Lee",
    role: "Founder, Brightpath",
  },
  {
    quote:
      "The engineering quality is outstanding. Our app is faster, more stable, and our users have noticed. We couldn't be happier with the partnership.",
    name: "David Chen",
    role: "CTO, Nimbus Labs",
  },
];

export function Reviews() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <h2 className="text-fluid-section font-light tracking-tight text-white">
          Our client <span className="italic">reviews</span>
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-shadow hover:shadow-[0_8px_40px_rgba(100,150,255,0.08)]"
            >
              <div className="flex gap-0.5 text-blue-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] font-light leading-relaxed text-white/75">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <div className="font-medium tracking-tight text-white">
                  {r.name}
                </div>
                <div className="mt-0.5 text-sm font-light text-white/55">
                  {r.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
