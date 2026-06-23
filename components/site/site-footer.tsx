import { Logo } from "@/components/site/logo";
import { BlueShader } from "@/components/ui/blue-shader";

const COLUMNS = [
  {
    heading: "Use cases",
    links: [
      "Product Development",
      "Collaborate With Team",
      "SaaS Dashboards",
      "Web Applications",
      "AI-Powered Solutions",
    ],
  },
  {
    heading: "Services",
    links: [
      "Software Development",
      "Web Development",
      "App Development",
      "UI/UX Design",
      "Product Strategy",
      "AI / Automation",
    ],
  },
  {
    heading: "Resources",
    links: ["Read our blog", "Partners", "News", "Documentation", "Status"],
  },
  {
    heading: "Contact",
    links: ["About", "Facebook", "Twitter", "LinkedIn", "Youtube"],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-black pt-20 text-white sm:pt-28">
      <BlueShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <Logo invert />

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {col.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-light text-white/55 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 mt-16 select-none overflow-hidden"
      >
        <div className="whitespace-nowrap text-center font-semibold leading-none tracking-tighter text-white/[0.04] [font-size:clamp(4rem,22vw,18rem)]">
          melloagency
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-16">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="transition-colors hover:text-white">
              Terms &amp; conditions
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Cookies
            </a>
          </div>
          <p>© 2026 mello agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
