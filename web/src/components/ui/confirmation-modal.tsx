"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-fade-in gpu">
      <div className="max-w-xl w-full bg-secondary border border-white/10 rounded-[32px] p-8 shadow-2xl flex flex-col gap-6 opacity-0 animate-fade-in-up">
        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircleIcon className="w-10 h-10 text-accent" />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-black tracking-tighter">{title}</h2>
          <p className="text-sm font-medium text-foreground/50 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all cursor-pointer shadow-lg shadow-accent/20 uppercase tracking-widest text-xs"
          >
            Yes, Finalize Draft
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-white/5 text-foreground font-black border border-border rounded-2xl hover:bg-accent/10 transition-all cursor-pointer text-xs uppercase tracking-widest"
          >
            Wait, I'll review more
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/30 hover:text-foreground transition-colors cursor-pointer"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
