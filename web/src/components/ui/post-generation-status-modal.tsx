"use client";

import { PublishingStatusStep } from "./post-generation-status-step";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

type Status = "pending" | "loading" | "completed" | "error";

interface Step {
  id: number;
  label: string;
  status: Status;
}

interface PublishingStatusModalProps {
  isOpen: boolean;
  steps: Step[];
  currentStepIndex: number;
  resetPipeline: () => void;
}

export function PublishingStatusModal({ isOpen, steps, currentStepIndex, resetPipeline }: PublishingStatusModalProps) {
  if (!isOpen) return null;

  const isFinished = steps[steps.length - 1].status === "completed";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/60 backdrop-blur-lg animate-fade-in gpu">
      <div className="max-w-md w-full bg-secondary/50 border border-white/10 rounded-[32px] p-8 shadow-2xl shadow-black/80 flex flex-col gap-8 opacity-0 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tighter">Publishing Pipeline</h2>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Multi-Channel Distribution</p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-500">
            {steps.filter(s => s.status === "completed").length} / {steps.length}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {steps.map((step, idx) => (
            <PublishingStatusStep
              key={step.id}
              label={step.label}
              status={step.status}
              isCurrent={idx <= currentStepIndex}
            />
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 mt-2">
          {isFinished ? (
            <div className="flex flex-col gap-4">
              <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircleIcon className="w-5 h-5" />
                  <p className="text-sm font-medium text-foreground/70">The content has been generated.</p>
                </div>
              </div>
              <Link
                href="/posts"
                className="w-full py-4 bg-accent text-white font-black rounded-xl hover:bg-accent/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl text-sm uppercase tracking-widest"
              >
                View Posts
                <ArrowForwardIcon className="w-4 h-4" />
              </Link>
            </div>
          ) : steps.some(s => s.status === "error") ? (
            <button
              onClick={resetPipeline}
              className="w-full py-4 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all text-sm uppercase tracking-widest cursor-pointer"
            >
              Retry Publishing
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
