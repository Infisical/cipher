/** Generic marks standing in for logos and other identity images in the media examples. */
export const placeholderMedia = {
  square: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" fill="var(--cipher-info)" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="var(--cipher-ok)" />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5 15 14.5H1z" fill="var(--cipher-warn)" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1 15 8 8 15 1 8z" fill="var(--cipher-accent)" />
    </svg>
  ),
  wide: (
    <svg viewBox="0 0 32 16" aria-hidden="true">
      <rect x="1" y="3" width="30" height="10" fill="var(--cipher-bad)" />
    </svg>
  )
};
