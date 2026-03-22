/** Availability styling — Dashboard + Profile */
export const AVAILABILITY_OPTIONS = [
  {
    key: 'available',
    label: 'Available',
    bg: 'var(--avail-green-bg)',
    color: 'var(--avail-green-text)',
    border: 'var(--avail-green-border)',
    dot: 'var(--avail-green-dot)',
  },
  {
    key: 'focused',
    label: 'Focused',
    bg: 'var(--avail-indigo-bg)',
    color: 'var(--avail-indigo-text)',
    border: 'var(--avail-indigo-border)',
    dot: 'var(--avail-indigo-dot)',
  },
  {
    key: 'meeting',
    label: 'In a Meeting',
    bg: 'var(--avail-amber-bg)',
    color: 'var(--avail-amber-text)',
    border: 'var(--avail-amber-border)',
    dot: 'var(--avail-amber-dot)',
  },
  {
    key: 'offline',
    label: 'Offline',
    bg: 'var(--avail-gray-bg)',
    color: 'var(--avail-gray-text)',
    border: 'var(--avail-gray-border)',
    dot: 'var(--avail-gray-dot)',
  },
];

export const availabilityByKey = Object.fromEntries(AVAILABILITY_OPTIONS.map((o) => [o.key, o]));

export function getAvailability(key) {
  return availabilityByKey[key] || availabilityByKey.available;
}
