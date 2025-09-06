import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SplitTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  children,
  className,
  delay = 50,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll(".split-letter");

    gsap.fromTo(
      letters,
      { ...from },
      {
        ...to,
        ease,
        duration,
        stagger: delay / 1000,
        onComplete: onLetterAnimationComplete,
      }
    );
  }, [children]);

  // Split only text nodes, leave spans/icons intact
  const splitContent = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      if (splitType === "chars") {
        return [...node].map((char, i) => (
          <span key={i} className="split-letter inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ));
      } else {
        return node.split(" ").map((word, i) => (
          <span key={i} className="split-letter inline-block mr-1">
            {word}
          </span>
        ));
      }
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => <span key={i}>{splitContent(child)}</span>);
    }

    return node; // keep icons or styled spans untouched
  };

  return (
    <div ref={containerRef} className={className}>
      {splitContent(children)}
    </div>
  );
}
