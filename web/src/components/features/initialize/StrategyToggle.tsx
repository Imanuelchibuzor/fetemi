"use client";

import { useRef, useEffect, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

interface StrategyToggleProps {
  inputType: "url" | "idea";
  onTypeSwitch: (type: "url" | "idea") => void;
}

export function StrategyToggle({ inputType, onTypeSwitch }: StrategyToggleProps) {
  const urlRef = useRef<HTMLButtonElement>(null);
  const ideaRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Recalculate the sliding indicator position on switch
  useEffect(() => {
    const activeRef = inputType === "url" ? urlRef.current : ideaRef.current;
    if (!activeRef) return;
    const parent = activeRef.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const activeRect = activeRef.getBoundingClientRect();

    setIndicatorStyle({
      left: activeRect.left - parentRect.left,
      width: activeRect.width,
    });
  }, [inputType]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 ml-1">
        Input Strategy
      </span>
      <div className="relative flex p-1.5 bg-background/50 rounded-2xl border border-white/5 w-full">
        {/* Animated sliding background */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-secondary rounded-xl shadow-lg border border-white/5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />

        <button
          ref={urlRef}
          type="button"
          onClick={() => onTypeSwitch("url")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors duration-300 z-10 ${
            inputType === "url" ? "text-primary" : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Source URL
        </button>

        <button
          ref={ideaRef}
          type="button"
          onClick={() => onTypeSwitch("idea")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors duration-300 z-10 ${
            inputType === "idea" ? "text-primary" : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          <LightbulbIcon className="w-3.5 h-3.5" />
          Seed Idea
        </button>
      </div>
    </div>
  );
}
