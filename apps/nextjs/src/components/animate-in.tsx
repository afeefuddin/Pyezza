"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "top";
  duration?: number;
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  from = "bottom",
  duration = 500,
}: AnimateInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const fromStyles = {
    bottom: "translate-y-10",
    left: "-translate-x-10",
    right: "translate-x-10",
    top: "-translate-y-10",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        isVisible
          ? "opacity-100 transform-none"
          : `opacity-0 ${fromStyles[from]}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
