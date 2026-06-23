import NeuralBackground from "@/components/ui/flow-field-background";

const STATS = [
  { value: "4K+", label: "Projects Delivered" },
  { value: "120+", label: "Happy Clients" },
  { value: "10M+", label: "Users Reached" },
  { value: "12 yrs", label: "Building Software" },
];

export function Stats() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-32"
    >
      {/* Particle flow-field background */}
      <div className="absolute inset-0">
        <NeuralBackground color="#818cf8" trailOpacity={0.1} speed={0.8} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-10 lg:gap-16 lg:px-16">
        <div>
          <h2 className="text-fluid-section font-light tracking-tight text-white">
            A team of builders &amp; <span className="italic">innovators</span>
          </h2>
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-white/70">
            From early-stage startups to established enterprises, we help our
            clients transform complex problems into simple, elegant solutions.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 self-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                {s.value}
              </dt>
              <dd className="mt-2 font-mono text-xs uppercase tracking-wider text-white/55">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
