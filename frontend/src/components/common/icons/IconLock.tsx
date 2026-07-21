interface IconProps {
  className?: string;
}

export default function IconLock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fill="currentColor"
        d="M16.25 8.988a.625.625 0 00-.625-.625H4.375a.625.625 0 00-.625.625v7.262c0 .345.28.625.625.625h11.25c.345 0 .625-.28.625-.625V8.988m-5.556 4.417H9.306v-2.161h1.388v2.16"
      />
      <path
        fill="currentColor"
        d="M14.792 8.625H13.75v-.851c0-1.997-1.667-3.634-3.68-3.667-1.007 0-1.98.36-2.674 1.015a3.366 3.366 0 00-1.111 2.52v.983H5.243v-.982c0-1.211.521-2.357 1.424-3.208a5.08 5.08 0 013.437-1.31c2.604.033 4.723 2.128 4.723 4.649v.851h-.035"
      />
    </svg>
  );
}
