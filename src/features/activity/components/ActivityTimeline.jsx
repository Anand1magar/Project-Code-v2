import { Link } from 'react-router-dom';
import { Phone, Mail, StickyNote, Users } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar.jsx';
import { formatDateTime, fromNow } from '../../../lib/date.js';

const TYPE_META = {
  call:    { Icon: Phone,      label: 'Call' },
  email:   { Icon: Mail,       label: 'Email' },
  note:    { Icon: StickyNote, label: 'Note' },
  meeting: { Icon: Users,      label: 'Meeting' },
};

export default function ActivityTimeline({ entries, usersById }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
        No activity logged yet. Log a note above to start the trail.
      </div>
    );
  }

  return (
    <ol className="relative border-l border-hairline pl-md">
      {entries.map((e) => {
        const { Icon, label } = TYPE_META[e.type] ?? TYPE_META.note;
        const author = usersById?.[e.authorId];
        const hasStudent = e.studentName && e.caseId;

        return (
          <li key={e.id} className="mb-md last:mb-0">
            <span className="absolute -left-[7px] flex h-3 w-3 items-center justify-center bg-canvas">
              <span className="h-2 w-2 bg-primary" />
            </span>

            <div className="border border-hairline bg-canvas p-md">
              {/* Header row: type label + timestamp */}
              <div className="flex items-center justify-between gap-sm">
                <div className="flex items-center gap-xs text-eyebrow text-ink-muted">
                  <Icon size={14} strokeWidth={1.5} />
                  {label}
                </div>
                <time
                  className="text-caption text-ink-subtle"
                  dateTime={e.createdAt}
                  title={formatDateTime(e.createdAt)}
                >
                  {fromNow(e.createdAt)}
                </time>
              </div>

              {/* Student name — only shown on dashboard (enriched entries have studentName) */}
              {hasStudent && (
                <div className="mt-xs">
                  <Link
                    to={`/cases/${e.caseId}`}
                    className="text-body-sm font-[600] text-ink hover:text-primary transition-colors"
                  >
                    {e.studentName}
                  </Link>
                </div>
              )}

              {/* Tag pills: country · course · intake */}
              {(e.countryRecommended || e.courseRecommended || e.intake) && (
                <div className="mt-xs flex flex-wrap gap-xs">
                  {e.countryRecommended && (
                    <span className="bg-surface-1 px-xs py-xxs text-caption text-ink-muted">
                      {e.countryRecommended}
                    </span>
                  )}
                  {e.courseRecommended && (
                    <span className="bg-surface-1 px-xs py-xxs text-caption text-ink-muted">
                      {e.courseRecommended}
                    </span>
                  )}
                  {e.intake && (
                    <span className="bg-surface-1 px-xs py-xxs text-caption text-ink-muted">
                      {e.intake}
                    </span>
                  )}
                </div>
              )}

              {/* Note body */}
              <div className="mt-xs text-body text-ink">{e.text}</div>

              {/* Author */}
              {author && (
                <div className="mt-sm flex items-center gap-xs text-caption text-ink-subtle">
                  <Avatar name={author.name} size={20} />
                  {author.name}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
