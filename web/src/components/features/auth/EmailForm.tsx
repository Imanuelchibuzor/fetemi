"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailForm({ 
  email, 
  setEmail, 
  error, 
  isSubmitting, 
  onSubmit 
}: EmailFormProps) {
  return (
    <div className="flex flex-col gap-6 opacity-0 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter">Welcome.</h1>
        <p className="text-foreground/50 font-medium">Access your editorial content generation engine.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
            Corporate Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className={`w-full px-5 py-4 bg-secondary/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:border-primary/50 transition-all font-medium text-sm`}
            required
            disabled={isSubmitting}
          />
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-white font-black rounded-2xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-xs uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Authenticating..." : "Continue"}
          {!isSubmitting && <ArrowForwardIcon className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
