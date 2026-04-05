interface CartoonButtonProps {
  label: string;
  href?: string;
  variant?: "primary" | "outline";
  hasHighlight?: boolean;
  onClick?: () => void;
}

export function CartoonButton({
  label,
  href,
  variant = "primary",
  hasHighlight = true,
  onClick,
}: CartoonButtonProps) {
  const base =
    "relative inline-block rounded-full border-2 px-9 py-4 font-label text-base font-bold overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:shadow-none";

  const variants = {
    primary:
      "bg-primary-container border-primary text-background hover:shadow-[0_4px_0_0_var(--color-primary)]",
    outline:
      "bg-surface-container-high border-outline text-on-surface hover:shadow-[0_4px_0_0_var(--color-outline)] hover:text-primary hover:border-primary",
  };

  const className = `${base} ${variants[variant]}`;

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {hasHighlight && (
        <span
          data-highlight
          className="absolute top-1/2 left-[-100%] h-24 w-16 -translate-y-1/2 rotate-12 bg-white/20 transition-all duration-500 ease-in-out group-hover:left-[200%]"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`group ${className}`} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={`group ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}
