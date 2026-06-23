import { ArrowUpRight } from "lucide-react";
import { BlueShader } from "@/components/ui/blue-shader";

const POSTS = [
  {
    title: "The Future of Web UX: Trends That Will Shape 2027",
    tag: "App Design",
    date: "Oct 2025",
    img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Shipping Faster Without Breaking Things",
    tag: "Engineering",
    date: "Nov 2025",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
  },
];

export function Blogs() {
  return (
    <section id="blog" className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <h2 className="text-fluid-section font-light tracking-tight text-white">
          mello <span className="italic">blog</span>
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {POSTS.map((post) => (
            <a key={post.title} href="#" className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-white/45">
                <span>{post.tag}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{post.date}</span>
              </div>
              <h3 className="mt-3 flex items-start gap-2 text-xl font-normal leading-snug tracking-tight text-white sm:text-2xl">
                {post.title}
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
