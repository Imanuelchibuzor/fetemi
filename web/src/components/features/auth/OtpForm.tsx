"use client";

import { useRef, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface OtpFormProps {
  otp: string[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  isSubmitting: boolean;
  onBack: () => void;
}

export function OtpForm({
  otp,
  handleOtpChange,
  handleOtpKeyDown,
  isSubmitting,
  onBack
}: OtpFormProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-8 opacity-0 animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors w-max cursor-pointer"
      >
        <ArrowBackIcon className="w-3 h-3" />
        Back to Email
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter">Verify.</h1>
        <p className="text-foreground/50 font-medium">Enter the 6-digit code sent to your email.</p>
      </div>

      <div className="flex justify-between gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            className="w-full aspect-square bg-secondary/50 border border-white/20 rounded-xl text-center text-xl font-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
          Didn't receive a code? <span className="text-primary cursor-pointer hover:underline">Resend</span>
        </p>
      </div>
    </div>
  );
}
