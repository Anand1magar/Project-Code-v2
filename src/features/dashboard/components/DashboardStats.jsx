import { Briefcase, AlertOctagon, GraduationCap, TrendingUp } from 'lucide-react';

export default function DashboardStats({ totals }) {
  const items = [
    {
      id:    'activeCases',
      label: 'Active cases',
      value: totals.activeCases ?? totals.cases ?? 0,
      icon:  Briefcase,
    },
    {
      id:    'atRisk',
      label: 'At risk',
      value: totals.atRisk,
      icon:  AlertOctagon,
      tone:  totals.atRisk > 0 ? 'error' : null,
    },
    {
      id:    'enrolledThisMonth',
      label: 'Enrolled this month',
      value: totals.enrolledThisMonth ?? 0,
      icon:  GraduationCap,
      tone:  (totals.enrolledThisMonth ?? 0) > 0 ? 'success' : null,
    },
    {
      id:    'conversionRate',
      label: 'Conversion rate',
      value: `${totals.conversionRate ?? 0}%`,
      icon:  TrendingUp,
    },
  ];

  return (
    <div className="grid gap-md md:grid-cols-4">
      {items.map(({ id, label, value, icon: Icon, tone }) => (
        <div key={label} className="flex items-center justify-between border border-hairline bg-canvas p-lg">
          <div>
            <div className="text-eyebrow text-ink-muted">{label}</div>
            <div className={
              'mt-xs text-display-md font-light ' +
              (tone === 'error' ? 'text-error' : tone === 'success' ? 'text-success' : 'text-ink')
            }>
              {value}
            </div>
            {id === 'conversionRate' && totals.totalCases != null && (
              <div className="mt-xxs text-caption text-ink-muted">
                {totals.totalEnrolled ?? 0} of {totals.totalCases} enrolled
              </div>
            )}
          </div>
          <Icon size={28} strokeWidth={1.25} className="text-ink-subtle" />
        </div>
      ))}
    </div>
  );
}
