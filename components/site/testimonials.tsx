"use client";

import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
  {
    text: "Really appreciate the effort and patience your team showed, especially with all the revisions. Professional throughout.",
    image: "/images/favicons/drshravanshetty.png",
    name: "Dr. Shravan Shetty",
    role: "Orthodontist",
  },
  {
    text: "Thank you for your meticulous work. Genuinely nice having you do the job.",
    image: "/images/favicons/drshannonfernandes.png",
    name: "Dr. Shannon Fernandes",
    role: "Gynaecologist",
  },
  {
    text: "They understood what we needed without much back and forth. Clean, professional, and our patients find it easy to use.",
    image: "/images/favicons/rivelinaligners.png",
    name: "Dr. Dheeraj",
    role: "Founder, Rivelin Aligners",
  },
  {
    text: "Got exactly what I asked for, no unnecessary complications. Easy to work with and delivered on time.",
    image: "/images/favicons/drjoylenegynaec.png",
    name: "Dr. Joylene D'Almeida",
    role: "Obstetrician & Gynaecologist",
  },
  {
    text: "Quick, reliable, and they didn't make me chase them for updates. The final result looked better than I expected.",
    image: "/images/favicons/drmariumanjumiftikhar.png",
    name: "Dr. Mariam Anjum Iftikhar",
    role: "Gynaec-Oncologist & Robotic Surgeon",
  },
  {
    text: "Clean work, fast turnaround. They kept things simple and the end result speaks for itself.",
    image: "/images/favicons/drvivianortho.png",
    name: "Dr. Vivian R D'Almeida",
    role: "Orthopaedic Surgeon",
  },
  {
    text: "We needed a team that could keep up with our pace and actually deliver. They did, no drama.",
    image: "/images/favicons/prasannatechnologies.png",
    name: "Prasanna Technologies",
    role: "Software Firm",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 5);
const thirdColumn = testimonials.slice(5, 7);

export function Testimonials() {
  return (
    <section
      className="relative bg-background py-20 text-foreground sm:py-28 md:py-32"
      style={
        {
          // Scope a dark theme to this section so the shadcn tokens render
          // against the site's dark aesthetic without affecting the rest of the page.
          "--background": "#0a0a0a",
          "--foreground": "#ffffff",
          "--border": "rgba(255,255,255,0.12)",
          "--card": "rgba(255,255,255,0.04)",
          "--primary": "#60a5fa",
          "--muted-foreground": "rgba(255,255,255,0.55)",
        } as React.CSSProperties
      }
    >
      <div className="z-10 mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
        >
          <div className="flex justify-center">
            <div className="rounded-lg border px-4 py-1 text-sm tracking-tight text-white/70">
              Testimonials
            </div>
          </div>
          <h2 className="mt-5 text-fluid-section font-light tracking-tight text-white">
            What our clients <span className="italic">say</span>
          </h2>
          <p className="mt-5 text-center font-light leading-relaxed text-white/60">
            Real words from the people we've built for.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
