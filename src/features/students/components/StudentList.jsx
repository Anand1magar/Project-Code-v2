import { useNavigate } from 'react-router-dom';
import { Table, THead, TH, TBody, TR, TD } from '../../../components/ui/Table.jsx';
import Avatar from '../../../components/ui/Avatar.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { formatDate } from '../../../lib/date.js';

export default function StudentList({ students }) {
  const nav = useNavigate();
  return (
    <Table>
      <THead>
        <TH>Student</TH>
        <TH>Target</TH>
        <TH>Email</TH>
        <TH>Phone</TH>
        <TH>Added</TH>
      </THead>
      <TBody>
        {students.map((s) => (
          <TR key={s.id} onClick={() => nav(`/students/${s.id}`)}>
            <TD>
              <div className="flex items-center gap-sm">
                <Avatar name={s.name} />
                <div>
                  <div className="text-ink font-[600]">{s.name}</div>
                  <div className="text-caption text-ink-subtle capitalize">{s.leadSource?.replace(/-/g, ' ')}</div>
                </div>
              </div>
            </TD>
            <TD><Badge tone="muted">{s.targetCountry}</Badge></TD>
            <TD className="text-ink-muted">{s.email}</TD>
            <TD className="text-ink-muted">{s.phone}</TD>
            <TD className="text-ink-muted">{formatDate(s.createdAt)}</TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
