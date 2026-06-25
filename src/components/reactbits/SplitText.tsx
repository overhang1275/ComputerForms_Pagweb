import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import "./SplitText.css";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words";
  from?: { opacity?: number; y?: number };
  to?: { opacity?: number; y?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  delay = 40,
  duration = 0.7,
  splitType = "words",
  from = { opacity: 0, y: 24 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);
  const parts = useMemo(() => splitType === "chars" ? [...text] : text.split(/(\s+)/), [splitType, text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (!visible || !onLetterAnimationComplete) return;
    const timer = setTimeout(onLetterAnimationComplete, parts.length * delay + duration * 1000);
    return () => clearTimeout(timer);
  }, [delay, duration, onLetterAnimationComplete, parts.length, visible]);

  return (
    <span ref={ref} className={`split-text ${className}`} style={{ textAlign }}>
      {parts.map((part, index) => (
        <span
          className="split-text-part"
          data-visible={visible}
          key={`${part}-${index}`}
          style={{
            "--split-delay": `${index * delay}ms`,
            "--split-duration": `${duration}s`,
            "--split-from-opacity": from.opacity ?? 0,
            "--split-from-y": `${from.y ?? 24}px`,
            "--split-to-opacity": to.opacity ?? 1,
            "--split-to-y": `${to.y ?? 0}px`,
          } as CSSProperties}
        >
          {part === " " ? "\u00A0" : part}
        </span>
      ))}
    </span>
  );
}
