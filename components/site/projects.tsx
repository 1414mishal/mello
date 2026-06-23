import { ArrowUpRight } from "lucide-react";
import { BlueShader } from "@/components/ui/blue-shader";

const PROJECTS = [
  {
    title: "Finance Management System",
    tag: "Web App",
    date: "Nov 2025",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Atlas Commerce Platform",
    tag: "Web App",
    date: "Jun 2025",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Nimbus Mobile Banking",
    tag: "Mobile",
    date: "Mar 2025",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Pulse Analytics Dashboard",
    tag: "Product",
    date: "Jan 2025",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-fluid-section font-light tracking-tight text-white">
            mello <span className="italic">projects</span>
          </h2>
          <a
            href="#"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Explore all projects
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <a key={p.title} href="#" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-start justify-between p-5">
                  <span className="rounded-full bg-black/50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80 backdrop-blur-sm">
                    {p.tag}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                    {p.date}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 flex items-center gap-2 text-lg font-normal tracking-tight text-white">
                {p.title}
                <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
