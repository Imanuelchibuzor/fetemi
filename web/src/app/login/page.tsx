"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import ShieldIcon from "@mui/icons-material/Shield";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const VALID_EMAIL = "imanuelchibuzor@gmail.com";
const VALID_OTP = "228855";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (email === VALID_EMAIL) {
        setIsOtpMode(true);
      } else {
        setError("Unauthorized device or email address detected. Access denied.");
      }
      setIsSubmitting(false);
    }, 1200);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    if (isOtpMode && otp.every(digit => digit !== "")) {
      const enteredOtp = otp.join("");
      if (enteredOtp === VALID_OTP) {
        handleSuccess();
      } else {
        setError("Invalid credentials. Access keys do not match neural records.");
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0")?.focus();
      }
    }
  }, [otp, isOtpMode]);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-all selection:bg-primary selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">Fetemi.</Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Side: Editorial Content & Image */}
        <div className="hidden md:flex flex-1 relative items-center justify-center p-12 bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/auth_hero_neural_security_1774211116485.png" 
              alt="Neural Security" 
              className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-[3000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-lg flex flex-col gap-6">
            <div className="w-16 h-1 bg-primary rounded-full mb-4" />
            <h1 className="text-6xl font-black tracking-tighter leading-tight italic">
              Neural <span className="text-primary not-italic">Identity.</span>
            </h1>
            <p className="text-xl text-foreground/60 font-medium leading-relaxed">
              Fetemi uses a proprietary multi-agent security protocol. Your identity must be verified through our neural node before accessing the editorial engine.
            </p>
            <div className="flex items-center gap-4 mt-8 opacity-40">
              <div className="p-2 border border-white/10 rounded-lg">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Session • v24.1</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md flex flex-col gap-10 relative z-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-black tracking-tighter shadow-sm">
                {isOtpMode ? "Verification Required" : "Access Console"}
              </h2>
              <p className="text-sm font-medium text-foreground/40 leading-relaxed uppercase tracking-widest">
                {isOtpMode ? "Neural key sent to your verified device" : "Provide your node identifier to continue"}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 animate-bounce">
                  <CheckCircleIcon className="w-12 h-12 text-accent" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black tracking-tight text-accent uppercase">Access Granted</h3>
                  <p className="text-sm opacity-50 font-medium mt-1">Directing to neural node...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-8">
                {!isOtpMode ? (
                  <div className="flex flex-col gap-2">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-primary transition-colors">
                        <AlternateEmailIcon className="w-5 h-5" />
                      </div>
                      <input 
                        required
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Node ID (Email address)"
                        className={`w-full bg-secondary/50 border-2 py-5 pl-14 pr-6 rounded-2xl font-bold text-sm outline-none transition-all ${
                          error ? "border-red-500/50 focus:border-red-500" : "border-white/5 focus:border-primary"
                        }`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 animate-fade-in-up">
                    <div className="flex justify-between gap-3">
                      {otp.map((digit, idx) => (
                        <input 
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          className={`w-12 h-16 md:w-14 md:h-20 text-center bg-secondary/50 border-2 rounded-2xl font-black text-2xl outline-none transition-all ${
                            error ? "border-red-500/50 focus:border-red-500" : "border-white/5 focus:border-primary"
                          }`}
                        />
                      ))}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsOtpMode(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mx-auto"
                    >
                      Change Identifier
                    </button>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in text-red-500">
                    <ErrorOutlineIcon className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                  </div>
                )}

                {!isOtpMode && (
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify Neural ID
                        <ArrowForwardIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </form>
            )}

            <div className="flex flex-col items-center gap-6 mt-4 opacity-20 hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-2">
                 <LockOutlinedIcon className="w-3 h-3" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">AES-256 Distributed System</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
