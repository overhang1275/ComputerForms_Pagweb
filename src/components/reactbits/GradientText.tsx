import type { CSSProperties, ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
};

export default function GradientText({
  children,
  colors = ["#002A45", "#D71920", "#F6B800", "#002A45"],
  animationSpeed = 8,
  showBorder = false,
  className = "",
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  const style = {
    "--gradient-text": gradient,
    "--gradient-speed": `${animationSpeed}s`,
  } as CSSProperties;

  return (
    <span className={`gradient-text ${showBorder ? "gradient-text-border" : ""} ${className}`} style={style}>
      {children}
    </span>
  );
}
