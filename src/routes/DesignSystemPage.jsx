/**
 * /design-system — Living style guide for VisaVista.
 * Every swatch, type style, spacing step, and component is rendered
 * using the actual production tokens and components — nothing mocked.
 * Automatically reflects the active light/dark theme.
 */
import { useState } from 'react';
import Button  from '../components/ui/Button.jsx';
import Input   from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Select  from '../components/ui/Select.jsx';
import Badge   from '../components/ui/Badge.jsx';
import Card    from '../components/ui/Card.jsx';
import Modal   from '../components/ui/Modal.jsx';
import Avatar  from '../components/ui/Avatar.jsx';
import Toast   from '../components/ui/Toast.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import { cn }  from '../lib/cn.js';

// ─── Left-nav sections ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'colors',       label: 'Colors' },
  { id: 'typography',   label: 'Typography' },
  { id: 'spacing',      label: 'Spacing' },
  { id: 'radius',       label: 'Border Radius' },
  { id: 'buttons',      label: 'Buttons' },
  { id: 'form-fields',  label: 'Form Fields' },
  { id: 'badges',       label: 'Badges' },
  { id: 'cards',        label: 'Cards' },
  { id: 'modals',       label: 'Modals' },
  { id: 'avatars',      label: 'Avatars' },
  { id: 'motion',       label: 'Motion' },
  { id: 'tokens',       label: 'Token Map' },
];

// ─── Helper components ────────────────────────────────────────────────────────

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-lg space-y-lg border-b border-hairline pb-xxl">
      <div>
        <h2 className="text-card-title font-light text-ink">{title}</h2>
        {description && <p className="mt-xs text-body-sm text-ink-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <div className="mb-sm text-caption text-ink-subtle uppercase tracking-[0.32px]">{label}</div>
      <div className="flex flex-wrap items-start gap-sm">{children}</div>
    </div>
  );
}

function Swatch({ label, tokenName, bgClass, textHex, border }) {
  return (
    <div className="w-36 space-y-xxs">
      <div
        className={cn('h-14 w-full rounded-none', bgClass, border && 'border border-hairline')}
      />
      <div className="text-body-sm text-ink">{label}</div>
      <div className="font-mono text-caption text-ink-subtle">{tokenName}</div>
      {textHex && <div className="font-mono text-caption text-ink-subtle">{textHex}</div>}
    </div>
  );
}

function TypeSpecimen({ label, className, sample = 'The quick brown fox' }) {
  return (
    <div className="flex items-baseline gap-xl border-b border-hairline py-sm last:border-b-0">
      <div className="w-36 shrink-0 text-caption text-ink-subtle">{label}</div>
      <div className={cn('min-w-0 flex-1 text-ink', className)}>{sample}</div>
    </div>
  );
}

function SpacingStep({ name, px }) {
  return (
    <div className="flex items-center gap-md">
      <div className="w-16 shrink-0 font-mono text-caption text-ink-muted">{name}</div>
      <div
        className="h-6 bg-primary shrink-0"
        style={{ width: px }}
      />
      <div className="text-caption text-ink-subtle">{px}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex min-h-full">

      {/* ── Left sidebar nav ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r border-hairline bg-canvas">
        <div className="sticky top-0 flex h-full flex-col pt-xl">
          <div className="px-md pb-md">
            <div className="text-eyebrow text-ink-muted">VisaVista</div>
            <div className="text-body-emphasis text-ink">Design System</div>
            <div className="mt-xs text-caption text-ink-subtle">IBM Carbon · v1.0</div>
          </div>

          <div className="border-t border-hairline px-md py-sm">
            <div className="mb-xs text-caption text-ink-subtle">Theme</div>
            <ThemeToggle />
          </div>

          <nav className="flex-1 overflow-y-auto border-t border-hairline py-sm">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="flex w-full items-center px-md py-xs text-left text-body-sm text-ink-muted hover:bg-surface-1 hover:text-ink transition-colors duration-fast"
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-hairline px-md py-md">
            <div className="text-caption text-ink-subtle">Source</div>
            <div className="mt-xxs font-mono text-caption text-ink-muted">tokens.css</div>
            <div className="font-mono text-caption text-ink-muted">tailwind.config.js</div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-xxl px-xl py-xxl">

          {/* Hero */}
          <div className="border-b border-hairline pb-xl">
            <p className="text-eyebrow text-ink-muted">VisaVista · IBM Carbon</p>
            <h1 className="mt-xs text-display-md font-light text-ink">Design System</h1>
            <p className="mt-sm text-body text-ink-muted max-w-xl">
              Every token, type style, and component is rendered live from the production
              codebase. Switch the theme in the sidebar — everything updates automatically.
            </p>
          </div>

          {/* ── 1. COLORS ──────────────────────────────────────────────────── */}
          <Section
            id="colors"
            title="Colors"
            description="One chromatic accent (IBM Blue), neutral grays, semantic statuses. All values are CSS variables so the dark theme swap is zero-JS."
          >
            <Row label="Brand — primary action">
              <Swatch label="Primary"        tokenName="color.primary"         bgClass="bg-primary"         textHex="#0f62fe (light) / #4589ff (dark)" />
              <Swatch label="Primary Hover"  tokenName="color.primary-hover"   bgClass="bg-primary-hover"   textHex="#0050e6 / #6ea6ff" />
              <Swatch label="Primary Pressed" tokenName="color.primary-pressed" bgClass="bg-primary-pressed" textHex="#002d9c / #0043ce" />
              <Swatch label="On Primary"     tokenName="color.on-primary"      bgClass="bg-on-primary"      textHex="#ffffff" border />
            </Row>

            <Row label="Text">
              <Swatch label="Ink"        tokenName="color.ink"        bgClass="bg-ink"        textHex="#161616 / #f4f4f4" />
              <Swatch label="Ink Muted"  tokenName="color.ink-muted"  bgClass="bg-ink-muted"  textHex="#525252 / #c6c6c6" />
              <Swatch label="Ink Subtle" tokenName="color.ink-subtle" bgClass="bg-ink-subtle" textHex="#8c8c8c / #8d8d8d" />
            </Row>

            <Row label="Surfaces">
              <Swatch label="Canvas"    tokenName="color.canvas"    bgClass="bg-canvas"    textHex="#ffffff / #161616" border />
              <Swatch label="Surface 1" tokenName="color.surface-1" bgClass="bg-surface-1" textHex="#f4f4f4 / #262626" border />
              <Swatch label="Surface 2" tokenName="color.surface-2" bgClass="bg-surface-2" textHex="#e0e0e0 / #393939" />
            </Row>

            <Row label="Inverse (dark island)">
              <Swatch label="Inverse Canvas"    tokenName="color.inverse-canvas"    bgClass="bg-inverse-canvas"    textHex="#161616 / #ffffff" />
              <Swatch label="Inverse Surface 1" tokenName="color.inverse-surface-1" bgClass="bg-inverse-surface-1" textHex="#262626 / #f4f4f4" />
              <Swatch label="Inverse Ink"       tokenName="color.inverse-ink"       bgClass="bg-inverse-ink"       textHex="#ffffff / #161616" border />
              <Swatch label="Inverse Ink Muted" tokenName="color.inverse-ink-muted" bgClass="bg-inverse-ink-muted" textHex="#c6c6c6 / #525252" />
            </Row>

            <Row label="Borders">
              <Swatch label="Hairline"        tokenName="color.hairline"        bgClass="bg-hairline"        textHex="#e0e0e0 / #393939" />
              <Swatch label="Hairline Strong" tokenName="color.hairline-strong" bgClass="bg-hairline-strong" textHex="#161616 / #f4f4f4" />
            </Row>

            <Row label="Semantic">
              <Swatch label="Success" tokenName="color.success" bgClass="bg-success" textHex="#24a148 / #42be65" />
              <Swatch label="Warning" tokenName="color.warning" bgClass="bg-warning" textHex="#f1c21b (both)" />
              <Swatch label="Error"   tokenName="color.error"   bgClass="bg-error"   textHex="#da1e28 / #fa4d56" />
              <Swatch label="Info"    tokenName="color.info"    bgClass="bg-info"    textHex="→ primary" />
            </Row>
          </Section>

          {/* ── 2. TYPOGRAPHY ─────────────────────────────────────────────── */}
          <Section
            id="typography"
            title="Typography"
            description="IBM Plex Sans. Three weights only: Light (300) for display, Regular (400) for body, Semibold (600) for emphasis. Letter-spacing 0.16px on body sizes."
          >
            <div className="border border-hairline bg-canvas px-lg py-md">
              <TypeSpecimen label="display-xl · 76px · 300"     className="text-display-xl font-light"   sample="Visa Vista" />
              <TypeSpecimen label="display-lg · 60px · 300"     className="text-display-lg font-light"   sample="Visa Vista" />
              <TypeSpecimen label="display-md · 42px · 300"     className="text-display-md font-light"   sample="Case pipeline" />
              <TypeSpecimen label="headline · 32px · 400"       className="text-headline"                sample="All students" />
              <TypeSpecimen label="card-title · 24px · 400"     className="text-card-title"              sample="Active cases" />
              <TypeSpecimen label="subhead · 20px · 400"        className="text-subhead"                 sample="Quick Inquiry Form" />
              <TypeSpecimen label="body-lg · 18px · 400"        className="text-body-lg"                 sample="Log a new student in under 2 minutes." />
              <TypeSpecimen label="body · 16px · 400 · +0.16px" className="text-body tracking-carbon"   sample="Student profile showing all contact details and cases." />
              <TypeSpecimen label="body-sm · 14px · 400"        className="text-body-sm"                 sample="Phone · Email · Target country · Lead source" />
              <TypeSpecimen label="body-emphasis · 14px · 600"  className="text-body-emphasis"           sample="NPR 25,000 · Bank Transfer" />
              <TypeSpecimen label="caption · 12px · 400"        className="text-caption"                 sample="Logged by Bibek Thapa · 3 hours ago" />
              <TypeSpecimen label="button · 14px · 400"         className="text-button"                  sample="Add student" />
              <TypeSpecimen label="eyebrow · 14px · 400"        className="text-eyebrow text-ink-muted"  sample="Students" />
            </div>
          </Section>

          {/* ── 3. SPACING ────────────────────────────────────────────────── */}
          <Section
            id="spacing"
            title="Spacing"
            description="Named scale instead of raw numbers. Use these token names in Tailwind: p-xxs, gap-md, px-xl, etc."
          >
            <div className="space-y-sm border border-hairline bg-canvas px-lg py-md">
              <SpacingStep name="xxs" px="4px" />
              <SpacingStep name="xs"  px="8px" />
              <SpacingStep name="sm"  px="12px" />
              <SpacingStep name="md"  px="16px" />
              <SpacingStep name="lg"  px="24px" />
              <SpacingStep name="xl"  px="32px" />
              <SpacingStep name="xxl" px="48px" />
              <SpacingStep name="section" px="96px" />
            </div>
          </Section>

          {/* ── 4. BORDER RADIUS ──────────────────────────────────────────── */}
          <Section
            id="radius"
            title="Border Radius"
            description="Square corners are the default everywhere — CTAs, cards, inputs, badges. Never add rounding beyond sm (4px) without explicit justification."
          >
            <div className="flex flex-wrap gap-xl border border-hairline bg-canvas p-lg">
              {[
                { name: 'none · 0px',  cls: 'rounded-none' },
                { name: 'xs · 2px',   cls: 'rounded-xs' },
                { name: 'sm · 4px',   cls: 'rounded-sm' },
                { name: 'pill · ∞',   cls: 'rounded-full' },
              ].map(({ name, cls }) => (
                <div key={name} className="space-y-xs text-center">
                  <div className={cn('h-16 w-16 bg-primary', cls)} />
                  <div className="text-caption text-ink-muted">{name}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 5. BUTTONS ────────────────────────────────────────────────── */}
          <Section
            id="buttons"
            title="Buttons"
            description="Five variants. IBM Blue (primary) is reserved for the single most important action per context. Never two primary buttons side by side."
          >
            <Row label="Variants — medium (default)">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Row>

            <Row label="Small size">
              <Button variant="primary"   size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="tertiary"  size="sm">Tertiary</Button>
              <Button variant="ghost"     size="sm">Ghost</Button>
              <Button variant="danger"    size="sm">Danger</Button>
            </Row>

            <Row label="Disabled state (all variants)">
              <Button variant="primary"   disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="tertiary"  disabled>Tertiary</Button>
              <Button variant="ghost"     disabled>Ghost</Button>
              <Button variant="danger"    disabled>Danger</Button>
            </Row>

            <div className="border border-hairline bg-canvas p-md space-y-xs">
              <div className="text-caption text-ink-muted">Usage rules</div>
              <ul className="list-disc pl-md space-y-xxs text-body-sm text-ink-muted">
                <li><span className="text-ink">Primary</span> — one per screen, the most important CTA (Add student, Save, Confirm)</li>
                <li><span className="text-ink">Secondary</span> — inverse treatment for dark surfaces or pairing with primary</li>
                <li><span className="text-ink">Tertiary</span> — outlined, for secondary actions in light areas (Edit, Export)</li>
                <li><span className="text-ink">Ghost</span> — transparent, for Cancel and low-emphasis actions</li>
                <li><span className="text-ink">Danger</span> — destructive actions only (Void, Delete) — never overuse</li>
              </ul>
            </div>
          </Section>

          {/* ── 6. FORM FIELDS ────────────────────────────────────────────── */}
          <Section
            id="form-fields"
            title="Form Fields"
            description="Bottom-border only (no full-box border) on inputs, textareas, and selects. Error state turns the bottom border red. Disabled state uses surface-1 background."
          >
            <Row label="Input — states">
              <div className="w-72 space-y-md">
                <Input label="Default"       placeholder="e.g. Roshan Thapa" />
                <Input label="With hint"     placeholder="98XXXXXXXX" hint="Nepal mobile number format" />
                <Input label="With error"    placeholder="Enter phone" error="Phone number is required" value="" onChange={() => {}} />
                <Input label="Disabled"      placeholder="—" disabled value="Bibek Thapa" onChange={() => {}} />
                <Input label="Email type"    type="email" placeholder="bibek@visavista.test" />
                <Input label="Number type"   type="number" placeholder="25000" />
                <Input label="Date type"     type="date" />
              </div>
            </Row>

            <Row label="Textarea">
              <div className="w-full max-w-md">
                <Textarea
                  label="Session notes (required, min 20 characters)"
                  placeholder="What was discussed, recommended, or decided? Why?"
                  rows={4}
                />
              </div>
            </Row>

            <Row label="Textarea — error state">
              <div className="w-full max-w-md">
                <Textarea
                  label="Rationale"
                  placeholder="Describe the reason…"
                  error="Minimum 20 characters required"
                  rows={3}
                />
              </div>
            </Row>

            <Row label="Select">
              <div className="w-72 space-y-md">
                <Select label="Target country">
                  <option>Australia</option>
                  <option>UK</option>
                  <option>USA</option>
                  <option>Canada</option>
                  <option>New Zealand</option>
                </Select>
                <Select label="Select — error" error="Required field">
                  <option value="">— select —</option>
                  <option>Australia</option>
                </Select>
                <Select label="Select — disabled" disabled>
                  <option>Australia</option>
                </Select>
              </div>
            </Row>
          </Section>

          {/* ── 7. BADGES ─────────────────────────────────────────────────── */}
          <Section
            id="badges"
            title="Badges"
            description="Compact status pills — all caps, 12px, 0.32px letter-spacing. Used for pipeline stages, document status, task urgency, offer status."
          >
            <Row label="All tones">
              <Badge tone="default">Default</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="error">Error</Badge>
              <Badge tone="muted">Muted</Badge>
            </Row>

            <Row label="In context — pipeline stages">
              <Badge tone="muted">Inquiry</Badge>
              <Badge tone="muted">Counselling</Badge>
              <Badge tone="info">Offer Received</Badge>
              <Badge tone="warning">Financials</Badge>
              <Badge tone="info">Visa Lodgement</Badge>
              <Badge tone="error">Visa Refused</Badge>
              <Badge tone="success">Enrolled</Badge>
            </Row>

            <Row label="In context — document status">
              <Badge tone="muted">Required</Badge>
              <Badge tone="warning">Pending</Badge>
              <Badge tone="info">Received</Badge>
              <Badge tone="success">Verified</Badge>
              <Badge tone="error">Rejected</Badge>
            </Row>

            <Row label="In context — tasks">
              <Badge tone="error">Overdue</Badge>
              <Badge tone="warning">Today</Badge>
            </Row>
          </Section>

          {/* ── 8. CARDS ──────────────────────────────────────────────────── */}
          <Section
            id="cards"
            title="Cards"
            description="1px hairline border, canvas background, no shadow. Hover state lifts to surface-1. Square corners always."
          >
            <Row label="Default card">
              <Card className="w-72">
                <div className="text-eyebrow text-ink-muted">Student</div>
                <div className="mt-xs text-card-title font-light text-ink">Roshan Thapa</div>
                <dl className="mt-md space-y-xs text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Phone</dt>
                    <dd className="text-ink">9841-111111</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Target</dt>
                    <dd className="text-ink">Australia</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Source</dt>
                    <dd className="text-ink">Walk-in</dd>
                  </div>
                </dl>
              </Card>
            </Row>

            <Row label="Stat card (dashboard)">
              <div className="flex items-center justify-between border border-hairline bg-canvas p-lg w-60">
                <div>
                  <div className="text-eyebrow text-ink-muted">Active cases</div>
                  <div className="mt-xs text-display-md font-light text-ink">11</div>
                </div>
                <div className="text-ink-subtle text-display-md font-light opacity-30">↗</div>
              </div>
            </Row>

            <Row label="Card with left accent border">
              <div className="border border-hairline border-l-2 border-l-error bg-canvas p-md w-80">
                <div className="text-body-emphasis text-ink">Kamala Rai · New Zealand</div>
                <div className="mt-xxs text-body-sm text-ink-muted">Collect GIC proof from bank</div>
                <div className="mt-xs text-caption text-error">⚠ Overdue · 18 Jun 2026</div>
              </div>
            </Row>
          </Section>

          {/* ── 9. MODALS ─────────────────────────────────────────────────── */}
          <Section
            id="modals"
            title="Modals"
            description="Centered overlay, canvas background, 1px hairline border. Max widths: sm (448px), md (512px — default), lg (672px)."
          >
            <Row label="Trigger">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            </Row>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Add student"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setModalOpen(false)}>Add student</Button>
                </>
              }
            >
              <div className="space-y-md">
                <Input label="Full name" placeholder="e.g. Sita Rai" />
                <Input label="Phone" placeholder="98XXXXXXXX" />
              </div>
            </Modal>

            <Row label="Sizes">
              <div className="flex flex-wrap gap-xs">
                {['sm', 'md', 'lg'].map((s) => (
                  <div key={s} className="border border-hairline bg-canvas px-md py-sm text-body-sm text-ink-muted">
                    size=&quot;{s}&quot; — {s === 'sm' ? '448px' : s === 'md' ? '512px' : '672px'}
                  </div>
                ))}
              </div>
            </Row>
          </Section>

          {/* ── 10. AVATARS ───────────────────────────────────────────────── */}
          <Section
            id="avatars"
            title="Avatars"
            description="Initials-based, square, charcoal background. Sizes passed as a pixel number. No profile photos — initials only."
          >
            <Row label="Sizes">
              {[20, 28, 36, 48, 64].map((size) => (
                <div key={size} className="flex flex-col items-center gap-xxs">
                  <Avatar name="Bibek Thapa" size={size} />
                  <span className="text-caption text-ink-subtle">{size}px</span>
                </div>
              ))}
            </Row>

            <Row label="Multiple people">
              <Avatar name="Anita Sharma"  size={32} />
              <Avatar name="Bibek Thapa"   size={32} />
              <Avatar name="Sushma Rai"    size={32} />
              <Avatar name="Roshan Thapa"  size={32} />
              <Avatar name="Kamala Rai"    size={32} />
            </Row>
          </Section>

          {/* ── 11. TOAST ─────────────────────────────────────────────────── */}
          <Section
            id="motion"
            title="Motion + Toast"
            description="Two durations only: fast (70ms) for hover/focus micro-interactions, moderate (150ms) for panels and reveals. IBM Carbon productive easing: cubic-bezier(0.2, 0, 0.38, 0.9)."
          >
            <Row label="Durations">
              <div className="space-y-sm">
                <div className="flex items-center gap-md">
                  <div className="w-28 text-caption text-ink-muted">fast · 70ms</div>
                  <div className="h-2 w-16 bg-primary transition-all duration-fast ease-productive hover:w-48" />
                  <div className="text-caption text-ink-subtle">hover to demo</div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-28 text-caption text-ink-muted">moderate · 150ms</div>
                  <div className="h-2 w-16 bg-primary transition-all duration-moderate ease-productive hover:w-48" />
                  <div className="text-caption text-ink-subtle">hover to demo</div>
                </div>
              </div>
            </Row>

            <Row label="Toast notification">
              <Button variant="tertiary" onClick={() => { setToastVisible(true); }}>
                Show toast
              </Button>
              <Toast
                message="Case details saved"
                visible={toastVisible}
                onDone={() => setToastVisible(false)}
              />
            </Row>

            <div className="border border-hairline bg-canvas p-md space-y-xs">
              <div className="text-caption text-ink-muted">Easing</div>
              <div className="font-mono text-body-sm text-ink">cubic-bezier(0.2, 0, 0.38, 0.9)</div>
              <div className="text-caption text-ink-subtle">IBM Carbon "productive" — fast initial movement, gentle deceleration. Never use bounce or spring.</div>
            </div>
          </Section>

          {/* ── 12. TOKEN MAP ─────────────────────────────────────────────── */}
          <Section
            id="tokens"
            title="Token Map"
            description="Every token name used in the codebase, its Tailwind class, and its resolved value. The same names appear in visavista-design-tokens.json for Figma."
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-1">
                    <th className="px-md py-sm text-left text-caption text-ink-muted font-normal">Token</th>
                    <th className="px-md py-sm text-left text-caption text-ink-muted font-normal">Tailwind class</th>
                    <th className="px-md py-sm text-left text-caption text-ink-muted font-normal">Light value</th>
                    <th className="px-md py-sm text-left text-caption text-ink-muted font-normal">Dark value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['primary',           'bg-primary / text-primary',           '#0f62fe', '#4589ff'],
                    ['primary-hover',     'bg-primary-hover',                    '#0050e6', '#6ea6ff'],
                    ['ink',               'text-ink',                            '#161616', '#f4f4f4'],
                    ['ink-muted',         'text-ink-muted',                      '#525252', '#c6c6c6'],
                    ['ink-subtle',        'text-ink-subtle',                     '#8c8c8c', '#8d8d8d'],
                    ['canvas',            'bg-canvas',                           '#ffffff', '#161616'],
                    ['surface-1',         'bg-surface-1',                        '#f4f4f4', '#262626'],
                    ['surface-2',         'bg-surface-2',                        '#e0e0e0', '#393939'],
                    ['inverse-canvas',    'bg-inverse-canvas',                   '#161616', '#ffffff'],
                    ['inverse-ink',       'text-inverse-ink',                    '#ffffff', '#161616'],
                    ['hairline',          'border-hairline',                     '#e0e0e0', '#393939'],
                    ['hairline-strong',   'border-hairline-strong',              '#161616', '#f4f4f4'],
                    ['success',           'text-success / bg-success',           '#24a148', '#42be65'],
                    ['warning',           'text-warning / bg-warning',           '#f1c21b', '#f1c21b'],
                    ['error',             'text-error / bg-error',               '#da1e28', '#fa4d56'],
                    ['spacing.xxs',       'p-xxs / gap-xxs / m-xxs',            '4px', '4px'],
                    ['spacing.xs',        'p-xs / gap-xs',                       '8px', '8px'],
                    ['spacing.sm',        'p-sm / gap-sm',                       '12px', '12px'],
                    ['spacing.md',        'p-md / gap-md',                       '16px', '16px'],
                    ['spacing.lg',        'p-lg / gap-lg',                       '24px', '24px'],
                    ['spacing.xl',        'p-xl / gap-xl',                       '32px', '32px'],
                    ['spacing.xxl',       'p-xxl / gap-xxl',                    '48px', '48px'],
                    ['border-radius.none','rounded-none',                        '0', '0'],
                    ['duration.fast',     'duration-fast',                       '70ms', '70ms'],
                    ['duration.moderate', 'duration-moderate',                   '150ms', '150ms'],
                  ].map(([token, cls, light, dark]) => (
                    <tr key={token} className="border-b border-hairline bg-canvas hover:bg-surface-1">
                      <td className="px-md py-xs font-mono text-caption text-ink">{token}</td>
                      <td className="px-md py-xs font-mono text-caption text-ink-muted">{cls}</td>
                      <td className="px-md py-xs font-mono text-caption text-ink-subtle">{light}</td>
                      <td className="px-md py-xs font-mono text-caption text-ink-subtle">{dark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}
