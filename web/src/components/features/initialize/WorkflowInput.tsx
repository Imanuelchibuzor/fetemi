"use client";

import { useEffect, useRef } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkIcon from "@mui/icons-material/Link";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

interface WorkflowInputProps {
  inputType: "url" | "idea";
  inputValue: string;
  onInputChange: (value: string) => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function WorkflowInput({
  inputType,
  inputValue,
  onInputChange,
  error,
  isSubmitting,
  onSubmit
}: WorkflowInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea whenever the input type changes, for a slick UX
  useEffect(() => {
    textareaRef.current?.focus();
  }, [inputType]);

  const isUrl = inputType === "url";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Label row */}
      <div className="flex items-center gap-2 ml-1">
        {isUrl
          ? <LinkIcon className="w-3.5 h-3.5 text-primary" />
          : <LightbulbOutlinedIcon className="w-3.5 h-3.5 text-foreground/40" />
        }
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
          {isUrl ? "Reference URL" : "Conceptual Spark"}
        </label>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        key={inputType} /* remount on type switch so placeholder animates in */
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={
          isUrl
            ? "https://authority-source.com/article"
            : "What's the core idea, angle, or thesis you want Fetemi to build around?"
        }
        rows={4}
        className={`w-full p-6 bg-background/50 border-2 rounded-3xl focus:outline-none transition-all duration-300 resize-none font-medium text-sm md:text-base leading-relaxed ${
          error
            ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.08)] focus:border-red-500"
            : "border-border focus:border-primary/60 shadow-md shadow-black/5"
        }`}
      />

      {/* Error — inline, never overlapping, animates on each new message */}
      {error && (
        <div
          key={error}
          className="flex items-start gap-2 px-2 animate-shake"
        >
          <span className="text-red-500 font-black text-base leading-none shrink-0 mt-0.5">⚡</span>
          <span className="text-[11px] font-bold text-red-500 leading-snug">{error}</span>
        </div>
      )}

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full py-5 bg-primary text-white font-black rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-primary/20 cursor-pointer mt-1"
      >
        <div className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running Agents...
            </>
          ) : (
            <>
              Launch Generation
              <ArrowForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
        {/* Sweep effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </button>
    </form>
  );
}
