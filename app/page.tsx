import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { WhyPartner } from "@/components/site/why-partner";
import { Services } from "@/components/site/services";
import { Projects } from "@/components/site/projects";
import { Testimonials } from "@/components/site/testimonials";
import { Blogs } from "@/components/site/blogs";
import { CTA } from "@/components/site/cta";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <WhyPartner />
        <Services />
        <Projects />
        <Testimonials />
        <Blogs />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}
