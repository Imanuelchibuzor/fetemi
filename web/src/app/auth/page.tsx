"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import ShieldIcon from "@mui/icons-material/Shield";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { auth } from "@/lib/auth";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If already authenticated, redirect to callbackUrl
  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push(callbackUrl);
    }
  }, [router, callbackUrl]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/request-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (!res.ok) return setError(result.error);

      setIsOtpMode(true);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

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

  const handleSuccess = useCallback(() => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push(callbackUrl);
    }, 1500);
  }, [router, callbackUrl]);

  const validateOtp = useCallback(async () => {
    const enteredOtp = otp.join("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: enteredOtp,
        }),
      });

      const result = await res.json();

      if (!res.ok) return setError(result.error);

      const token = await auth.generateToken(email);
      auth.saveSession(email, token);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error).message);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [otp, email, handleSuccess]);

  useEffect(() => {
    if (isOtpMode && otp.every((digit) => digit !== "")) {
      validateOtp();
    }
  }, [otp, isOtpMode, validateOtp]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-all selection:bg-primary selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tighter hover:text-primary transition-colors"
          >
            Fetemi.
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row pt-16">
        {/* Left Side: Welcoming Content */}
        <div className="flex-1 relative flex items-center justify-center p-8 md:p-16 bg-secondary/20 border-r border-border/50 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Abstract algorithmic background"
              fill
              className="object-cover opacity-20 dark:opacity-10 grayscale"
              priority
            />
          </div>

          <div className="relative z-10 max-w-lg flex flex-col gap-8 text-center md:text-left">
            <div className="flex items-center gap-3 text-primary">
              <WavingHandIcon className="w-6 h-6" />
              <span className="font-black uppercase tracking-[0.2em] text-xs">
                Welcome Back
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Elevate Your <span className="text-primary italic">Story.</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/60 font-medium leading-relaxed">
                Step into the Fetemi Content Automation Platform. Verify your
                identity and start orchestrating your content pipeline.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-4 p-6 bg-background/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-xl gpu">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest leading-none">
                  Secure Access Node
                </span>
                <span className="text-[10px] opacity-40 font-bold mt-1">
                  Hashed Verification Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md flex flex-col gap-10 relative z-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-black tracking-tighter">
                {isOtpMode ? "Check your mail" : "Identify yourself"}
              </h2>
              <p className="text-sm font-medium text-foreground/40 leading-relaxed uppercase tracking-widest">
                {isOtpMode
                  ? "A 6-digit code has been dispatched"
                  : "Enter your email to resume your session"}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 animate-bounce">
                  <CheckCircleIcon className="w-14 h-14 text-accent" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black tracking-tight text-accent uppercase">
                    Welcome Back
                  </h3>
                  <p className="text-sm opacity-50 font-medium mt-1">
                    Synchronizing your node...
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col gap-8"
              >
                {!isOtpMode ? (
                  <div className="flex flex-col gap-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-primary transition-colors">
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
                        placeholder="email@example.com"
                        className={`w-full bg-secondary/50 border-2 py-6 pl-16 pr-8 rounded-3xl font-bold text-base outline-none transition-all ${
                          error
                            ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)] focus:border-red-500"
                            : "border-border focus:border-primary shadow-lg shadow-black/5"
                        }`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 animate-fade-in-up">
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
                          disabled={isSubmitting}
                          className={`w-12 h-16 md:w-16 md:h-24 text-center bg-secondary/50 border-2 rounded-3xl font-black text-3xl outline-none transition-all ${
                            error
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-border focus:border-primary disabled:opacity-50"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsOtpMode(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mx-auto flex items-center gap-2 disabled:opacity-30"
                    >
                      <ArrowForwardIcon className="w-3 h-3 rotate-180" />
                      Try different email
                    </button>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-[20px] animate-fade-in text-red-500">
                    <ErrorOutlineIcon className="w-6 h-6 shrink-0" />
                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                  </div>
                )}

                {!isOtpMode && (
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-6 bg-primary text-white font-black rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 text-sm uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowForwardIcon className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </form>
            )}

            <div className="flex flex-col items-center gap-6 mt-4 opacity-30">
              <div className="flex items-center gap-2">
                <LockOutlinedIcon className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Secure Access Protocol
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
