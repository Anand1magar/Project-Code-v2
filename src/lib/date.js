import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatDate(iso) {
  if (!iso) return '—';
  return dayjs(iso).format('DD MMM YYYY');
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return dayjs(iso).format('DD MMM YYYY, HH:mm');
}

export function fromNow(iso) {
  if (!iso) return '—';
  return dayjs(iso).fromNow();
}

export function isOverdue(iso) {
  if (!iso) return false;
  return dayjs(iso).isBefore(dayjs(), 'day');
}

export function isToday(iso) {
  if (!iso) return false;
  return dayjs(iso).isSame(dayjs(), 'day');
}

export { dayjs };
