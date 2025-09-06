import React, { ReactNode } from "react";

type ShinyDivProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

const ShinyDiv: React.FC<ShinyDivProps> = ({ children, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.05) 60%)",
        backgroundSize: "200% 100%",
        animation: `shine ${animationDuration} linear infinite`,
      }}
    >
      {children}
    </div>
  );
};

export default ShinyDiv;
