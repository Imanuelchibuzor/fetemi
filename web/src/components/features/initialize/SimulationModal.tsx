"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GenerationStatusStep } from "@/components/ui/draft-generation-status-step";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Step {
  id: number;
  label: string;
  status: "pending" | "loading" | "completed" | "error";
}

interface SimulationModalProps {
  isOpen: boolean;
  steps: Step[];
  currentStepIndex: number;
  onReset: () => void;
}

export function SimulationModal({ isOpen, steps, currentStepIndex, onReset }: SimulationModalProps) {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (steps.every(s => s.status === "completed")) {
      const timer = setTimeout(() => setShowButton(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [steps]);

  if (!isOpen) return null;

  const isFinished = steps[steps.length - 1].status === "completed";
  const hasError = steps.some(s => s.status === "error");

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-background/60 backdrop-blur-lg animate-fade-in gpu">
      <div className="max-w-md w-full bg-secondary/50 border border-white/10 rounded-4xl p-8 shadow-2xl shadow-black/80 flex flex-col gap-8 opacity-0 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tighter">Generation Pipeline</h2>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Multi-Agent Content Engine</p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-500">
            {steps.filter(s => s.status === "completed").length} / {steps.length}
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-5">
          {steps.map((step, idx) => (
            <GenerationStatusStep
              key={step.id}
              label={step.label}
              status={step.status}
              isCurrent={idx <= currentStepIndex}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 mt-2">
          {isFinished && showButton ? (
            <button
              onClick={() => router.push("/review")}
              className="w-full py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl text-sm uppercase tracking-widest"
            >
              Review Drafts
              <ArrowForwardIcon className="w-4 h-4" />
            </button>

          ) : hasError ? (
            <button
              onClick={onReset}
              className="w-full py-4 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all text-sm uppercase tracking-widest cursor-pointer"
            >
              Retry Pipeline
            </button>
          ) : (
            <div className="w-full h-12 flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Generating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
