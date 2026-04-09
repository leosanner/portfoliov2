import type { SVGProps } from "react";

/**
 * Leonardo Sanner monogram — outlined "L" in primary green overlapping an
 * outlined "S" in the current text color. Used in the footer and as the
 * site favicon.
 */
export function LSLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LS monogram"
      {...props}
    >
      <text
        x="14"
        y="66"
        fontFamily="'Manrope','Arial Black',sans-serif"
        fontSize="74"
        fontWeight="900"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        fill="none"
        letterSpacing="-4"
      >
        L
      </text>
      <text
        x="54"
        y="66"
        fontFamily="'Manrope','Arial Black',sans-serif"
        fontSize="74"
        fontWeight="900"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        letterSpacing="-4"
      >
        S
      </text>
    </svg>
  );
}
