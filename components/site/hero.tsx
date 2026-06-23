import { ArrowUpRight } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black">
      {/* Liquid-metal shader background */}
      <div className="absolute inset-0 [&>div]:h-full">
        <ShaderAnimation />
      </div>

      {/* Legibility gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 sm:pb-20 md:px-10 md:pb-24 lg:px-16">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/80">
            Creative engineering studio
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl text-fluid-hero font-light tracking-tight text-white">
          We combine creativity with engineering discipline to build products
          users <span className="italic">love.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/75 sm:text-lg">
          mello agency partners with founders and teams to design, build, and
          scale digital products — from first prototype to production.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            View our work
          </a>
        </div>
      </div>
    </section>
  );
}
