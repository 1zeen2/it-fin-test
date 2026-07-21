interface IconCategoryProps {
  isActive: boolean;
  className?: string;
}

export default function IconCategory({
  isActive,
  className = '',
}: IconCategoryProps) {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      {isActive ? (
        <g>
          <path
            fill="currentColor"
            d="M11.015 6.522a4.51 4.51 0 11-9.02 0 4.51 4.51 0 019.02 0z"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M13.058 4.83a2.725 2.725 0 012.725-2.724h3.382a2.725 2.725 0 012.725 2.725v3.382a2.725 2.725 0 01-2.725 2.725h-3.382a2.725 2.725 0 01-2.725-2.725V4.83zM2.106 15.827a2.725 2.725 0 012.724-2.724h3.383a2.725 2.725 0 012.724 2.724v3.383a2.725 2.725 0 01-2.724 2.724H4.83a2.725 2.725 0 01-2.724-2.724v-3.383zm13.401-1.538c.862-1.493 3.017-1.493 3.88 0l2.172 3.763c.862 1.493-.216 3.36-1.94 3.36h-4.345c-1.724 0-2.802-1.867-1.94-3.36l2.173-3.763z"
            clipRule="evenodd"
          ></path>
        </g>
      ) : (
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          className={className}
        >
          <path
            stroke="currentColor"
            strokeWidth="1.8"
            d="M10.115 6.522a3.61 3.61 0 11-7.22 0 3.61 3.61 0 017.22 0zm3.843-1.691c0-1.008.817-1.825 1.825-1.825h3.382c1.008 0 1.825.817 1.825 1.825v3.382a1.825 1.825 0 01-1.825 1.825h-3.382a1.825 1.825 0 01-1.825-1.825V4.83zM3.006 15.827c0-1.007.817-1.824 1.824-1.824h3.383c1.007 0 1.824.817 1.824 1.824v3.383a1.825 1.825 0 01-1.824 1.824H4.83a1.825 1.825 0 01-1.824-1.824v-3.383zm13.28-1.088a1.34 1.34 0 012.321 0l2.173 3.763a1.34 1.34 0 01-1.16 2.01h-4.346a1.34 1.34 0 01-1.16-2.01l2.172-3.763z"
          ></path>
        </svg>
      )}
    </svg>
  );
}
