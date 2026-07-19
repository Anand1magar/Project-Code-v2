import { useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { authService } from '../features/auth/authService.js';
import { FLOWS } from '../features/flow/flowsConfig.js';
import FlowSection from '../features/flow/components/FlowSection.jsx';

export default function FlowPage() {
  // Screens are pre-rendered static images (see flowsConfig.js), so this
  // page needs no session to display anything. We still establish one on
  // mount, fire-and-forget: scripts/capture-flow-screens.mjs loads this
  // page first to get a valid session before navigating to the real,
  // auth-gated routes it screenshots, reusing this instead of its own
  // separate login mechanism.
  useEffect(() => {
    authService.me().catch(() => authService.login({ role: 'admin' }));
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <PageHeader
        eyebrow="Internal"
        title="VisaVista — Product Flows"
        description="How the app actually works, screen by screen."
      />
      <div className="flex flex-col gap-xl p-xl">
        {FLOWS.map((flow, i) => (
          <FlowSection key={flow.id} index={i + 1} flow={flow} />
        ))}
      </div>
    </div>
  );
}
