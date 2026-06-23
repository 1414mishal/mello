import { Boxes, Headset, Cpu, Users } from "lucide-react";
import { BlueShader } from "@/components/ui/blue-shader";

const FEATURES = [
  {
    icon: Boxes,
    title: "Custom Solutions",
    body: "Tailored software crafted to meet your unique business challenges and goals.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    body: "Reliable assistance and maintenance to ensure your systems run smoothly.",
  },
  {
    icon: Cpu,
    title: "Innovative Tech",
    body: "Cutting-edge technologies to drive efficiency and competitive advantage.",
  },
  {
    icon: Users,
    title: "Expert Team",
    body: "Seasoned professionals committed to delivering excellence in every project.",
  },
];

export function WhyPartner() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <h2 className="text-fluid-section font-light tracking-tight text-white">
          Why partner <span className="italic">with us</span>
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-xl font-medium tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-3 text-[15px] font-light leading-relaxed text-white/60">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
