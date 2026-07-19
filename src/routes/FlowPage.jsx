import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { authService } from '../features/auth/authService.js';
import { FLOWS } from '../features/flow/flowsConfig.js';
import FlowSection from '../features/flow/components/FlowSection.jsx';

export default function FlowPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    authService.me()
      .catch(() => authService.login({ role: 'admin' }))
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

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
