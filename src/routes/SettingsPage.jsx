import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { Table, THead, TH, TBody, TR, TD } from '../components/ui/Table.jsx';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import { useUsers } from '../features/users/hooks/useUsers.js';

function toId(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function SettingsPage() {
  const { config, loading, update } = usePipeline();
  const { users, create: createUser, update: updateUser } = useUsers();

  if (loading || !config) return <div className="p-xl"><Spinner /></div>;

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Workspace settings" description="Configure pipeline stages, documents checklist, and counsellor accounts." />
      <div className="space-y-xl p-xl">
        <PipelineStagesCard stages={config.stages} onSave={(stages) => update({ stages })} />
        <ChecklistCard checklist={config.checklist} onSave={(checklist) => update({ checklist })} />
        <UsersCard users={users} onCreate={createUser} onUpdate={updateUser} />
      </div>
    </div>
  );
}

function PipelineStagesCard({ stages, onSave }) {
  const [items, setItems] = useState(stages);
  const [newLabel, setNewLabel] = useState('');
  useEffect(() => setItems(stages), [stages]);

  function add() {
    if (!newLabel.trim()) return;
    setItems((cur) => [...cur, { id: toId(newLabel), label: newLabel.trim() }]);
    setNewLabel('');
  }
  function remove(id) {
    setItems((cur) => cur.filter((s) => s.id !== id));
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-eyebrow text-ink-muted">Pipeline stages</div>
        <Button size="sm" onClick={() => onSave(items)}>Save stages</Button>
      </div>
      <ul className="mt-md divide-y divide-hairline border border-hairline bg-canvas">
        {items.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-md px-md py-sm">
            <div>
              <div className="text-body-sm text-ink">{s.label}</div>
              <div className="text-caption text-ink-subtle">{s.id}</div>
            </div>
            <button onClick={() => remove(s.id)} className="text-ink-muted hover:text-error" aria-label={`Remove ${s.label}`}>
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-md flex items-end gap-sm">
        <div className="flex-1">
          <Input label="Add stage" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Pre-departure" />
        </div>
        <Button variant="tertiary" onClick={add}>
          <Plus size={14} strokeWidth={1.5} /> Add
        </Button>
      </div>
    </Card>
  );
}

function ChecklistCard({ checklist, onSave }) {
  const [items, setItems] = useState(checklist);
  const [newLabel, setNewLabel] = useState('');
  useEffect(() => setItems(checklist), [checklist]);

  function add() {
    if (!newLabel.trim()) return;
    setItems((cur) => [...cur, { id: toId(newLabel), label: newLabel.trim() }]);
    setNewLabel('');
  }
  function remove(id) {
    setItems((cur) => cur.filter((s) => s.id !== id));
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-eyebrow text-ink-muted">Document checklist</div>
        <Button size="sm" onClick={() => onSave(items)}>Save checklist</Button>
      </div>
      <ul className="mt-md divide-y divide-hairline border border-hairline bg-canvas">
        {items.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-md px-md py-sm">
            <div>
              <div className="text-body-sm text-ink">{s.label}</div>
              <div className="text-caption text-ink-subtle">{s.id}</div>
            </div>
            <button onClick={() => remove(s.id)} className="text-ink-muted hover:text-error" aria-label={`Remove ${s.label}`}>
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-md flex items-end gap-sm">
        <div className="flex-1">
          <Input label="Add document" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. GIC proof" />
        </div>
        <Button variant="tertiary" onClick={add}>
          <Plus size={14} strokeWidth={1.5} /> Add
        </Button>
      </div>
    </Card>
  );
}

function UsersCard({ users, onCreate, onUpdate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('counsellor');

  async function add(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    await onCreate({ name: name.trim(), email: email.trim(), role });
    setName(''); setEmail(''); setRole('counsellor');
  }

  return (
    <Card>
      <div className="text-eyebrow text-ink-muted">Users</div>
      <Table className="mt-md">
        <THead>
          <TH>Name</TH>
          <TH>Email</TH>
          <TH>Role</TH>
        </THead>
        <TBody>
          {users.map((u) => (
            <TR key={u.id}>
              <TD>{u.name}</TD>
              <TD className="text-ink-muted">{u.email}</TD>
              <TD>
                <Select
                  value={u.role}
                  onChange={(e) => onUpdate(u.id, { role: e.target.value })}
                  className="h-9"
                >
                  <option value="admin">Admin</option>
                  <option value="counsellor">Counsellor</option>
                </Select>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <form onSubmit={add} className="mt-md grid gap-md md:grid-cols-[1fr_1fr_180px_auto] md:items-end">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="counsellor">Counsellor</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit"><Plus size={14} strokeWidth={1.5} /> Add user</Button>
      </form>
    </Card>
  );
}
