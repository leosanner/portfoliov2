import { BarChart3, LineChart, Sparkles } from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";

const placeholders = [
  {
    icon: BarChart3,
    title: "Traffic",
    copy: "Page views, unique visitors, and top referrers over time.",
  },
  {
    icon: LineChart,
    title: "Engagement",
    copy: "Scroll depth, time-on-page, and project click-through rates.",
  },
  {
    icon: Sparkles,
    title: "Insights",
    copy: "Which projects resonate the most and where visitors come from.",
  },
];

export function AnalyticsPage() {
  return (
    <AdminLayout>
      <header className="mb-10">
        <div className="mb-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Workspace
        </div>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
          Analytics
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-on-surface-variant">
          Coming soon — portfolio metrics will be added here.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {placeholders.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-surface-container-low/60"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            <div className="relative">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container/60 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="font-headline text-lg font-bold text-on-surface">
                {title}
              </div>
              <p className="mt-1.5 font-body text-sm text-on-surface-variant">
                {copy}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 px-2.5 py-1 font-label text-[10px] font-medium uppercase tracking-[0.14em] text-on-surface-variant/70">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Coming soon
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
