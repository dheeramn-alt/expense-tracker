import { Bell } from "lucide-react";

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-forest">{eyebrow}</p>}
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <button aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500">
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral ring-2 ring-white" />
        </button>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f0c7a8] text-sm font-black text-[#6e4027]">DD</div>
      </div>
    </header>
  );
}
