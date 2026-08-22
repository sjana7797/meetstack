import { Building2, Compass, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

const COMPANIES = [
  { name: "Acme Labs", icon: Cpu },
  { name: "Northwind Tech", icon: Layers },
  { name: "Vertex Media", icon: Compass },
  { name: "Orbital Systems", icon: Zap },
  { name: "Kestrel Global", icon: Building2 },
  { name: "Cipher Security", icon: ShieldCheck },
];

export function LogoStrip() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-border/50 bg-muted/20 px-6 py-8 backdrop-blur-sm">
        <p className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Trusted by fast-moving engineering & design teams worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {COMPANIES.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="flex items-center gap-2 text-muted-foreground/60 transition-colors hover:text-foreground select-none"
            >
              <Icon className="size-4.5" />
              <span className="text-sm font-semibold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
