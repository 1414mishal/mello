import { ArrowUpRight } from "lucide-react";
import { BlueShader } from "@/components/ui/blue-shader";

const SERVICES = [
  {
    n: "01",
    title: "Web App Development",
    body: "Build blazing-fast web applications with clean architecture and scalable infrastructure.",
  },
  {
    n: "02",
    title: "Mobile App Development",
    body: "Native-quality iOS and Android experiences that feel fast, fluid, and effortless.",
  },
  {
    n: "03",
    title: "API & Backend Solutions",
    body: "Robust, secure backends and APIs engineered to grow with your product.",
  },
  {
    n: "04",
    title: "Maintenance & Growth",
    body: "Ongoing support, performance tuning, and iteration to keep you ahead.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <h2 className="text-fluid-section font-light tracking-tight text-white">
          Our <span className="italic">services</span>
        </h2>

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {SERVICES.map((s) => (
            <a
              key={s.n}
              href="#contact"
              className="group grid grid-cols-1 gap-3 py-8 transition-colors hover:bg-white/[0.03] sm:grid-cols-[auto_1fr_1.2fr] sm:items-start sm:gap-8 md:py-10"
            >
              <span className="font-mono text-sm text-white/40 sm:pt-1.5">
                #{s.n}
              </span>
              <h3 className="flex items-center gap-2 text-2xl font-normal tracking-tight text-white sm:text-3xl">
                {s.title}
                <ArrowUpRight className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
              </h3>
              <p className="max-w-md text-[15px] font-light leading-relaxed text-white/60">
                {s.body}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
