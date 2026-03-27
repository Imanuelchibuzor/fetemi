"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(auth.isAuthenticated());
  }, []);

  const handleStartWorkflow = () => {
    if (auth.isAuthenticated()) {
      router.push("/initialize");
    } else {
      router.push("/auth?callbackUrl=/initialize");
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white transition-all duration-500 font-sans">
      <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">Fetemi.</div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {auth.isAuthenticated() && (
              <>
                <Link
                  href="/articles"
                  className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Articles
                </Link>
                <Link
                  href="/posts"
                  className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Posts
                </Link>
              </>
            )}
            <ThemeToggle />
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                title="Logout Session"
                aria-label="Logout Session"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Logout Toast */}
      {showLogoutToast && (
        <Toast
          type="success"
          title="Session Terminated"
          message="Logged out successfully."
          onClose={() => setShowLogoutToast(false)}
        />
      )}

      <main className="flex-1 pt-20">
        {/* HERO SECTION */}
        <section className="relative min-h-[calc(100vh-80px)] px-6 py-24 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center content-center">
          <div className="flex flex-col gap-8 z-10 opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-muted text-foreground rounded-full w-max border border-border">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Content Engine Live
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9]">
              Scale <br />
              <span className="text-primary italic">Content.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-md font-medium leading-relaxed">
              The end-to-end automated publishing pipeline for Fetemi Marketing.
              Grounded in human decisions, scaled by AI.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleStartWorkflow}
                className="px-10 py-5 bg-primary text-white font-black rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group shadow-2xl shadow-primary/20 text-sm uppercase tracking-widest"
              >
                Initialize Workflow
                <ArrowForwardIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="aspect-square lg:aspect-4/5 overflow-hidden bg-muted border border-border rounded-[40px] opacity-0 animate-fade-in-up delay-150 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Abstract algorithmic structures"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section
          id="how-it-works"
          className="min-h-screen px-6 py-24 bg-foreground text-background flex flex-col justify-center"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-16 opacity-0 animate-fade-in-up delay-300">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-background">
                The Automation Process.
              </h2>
              <p className="text-background/70 max-w-xl text-lg">
                A zero-friction pipeline powered by n8n. Submit an idea, let the
                AI generate optimized drafts, review, and publish across all
                platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group border border-background/20 p-10 flex flex-col gap-6 hover:bg-white/5 hover:border-white/10 transition-colors duration-300 rounded-4xl opacity-0 animate-fade-in-up delay-400">
                <div className="w-14 h-14 flex items-center justify-center bg-background text-foreground rounded-2xl shadow-lg">
                  <EditNoteIcon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-background">
                  1. Input & Ideation
                </h3>
                <p className="text-background/80 leading-relaxed font-medium">
                  Submit a raw content idea or a URL. The system automatically
                  extracts, summarizes, and structures the core themes as the
                  base formulation.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group border border-background/20 p-10 flex flex-col gap-6 hover:bg-white/5 hover:border-white/10 transition-colors duration-300 rounded-4xl opacity-0 animate-fade-in-up delay-500">
                <div className="w-14 h-14 flex items-center justify-center bg-background text-foreground rounded-2xl shadow-lg">
                  <AutoFixHighIcon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-background">
                  2. Triplicate Generation
                </h3>
                <p className="text-background/80 leading-relaxed font-medium">
                  Generate three unique article drafts from the input. Each
                  strictly adheres to SEO best practices and presents the topic
                  from a different angle.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group border border-background/20 p-10 flex flex-col gap-6 hover:bg-white/5 hover:border-white/10 transition-colors duration-300 rounded-4xl opacity-0 animate-fade-in-up delay-600">
                <div className="w-14 h-14 flex items-center justify-center bg-background text-foreground rounded-2xl shadow-lg">
                  <ShareIcon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-background">
                  3. Review & Distribution
                </h3>
                <p className="text-background/80 leading-relaxed font-medium">
                  Select the best draft in the UI. The engine adapts it for
                  LinkedIn, X (Threads), and Newsletters before secure
                  multi-channel distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* V1.0 DISTRIBUTION SECTION */}
        <section className="px-6 py-32 bg-background border-t border-border/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="aspect-square lg:aspect-4/5 overflow-hidden rounded-[60px] shadow-2xl opacity-0 animate-fade-in-up delay-300">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2574&auto=format&fit=crop"
                alt="Professional Team Collaboration"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6 opacity-0 animate-fade-in-up">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                  Growth <br />
                  <span className="text-primary italic">Distribution.</span>
                </h2>
                <p className="text-foreground/60 max-w-md text-xl font-medium leading-relaxed">
                  The Fetemi engine doesn&apos;t just write; it adapts. One core
                  formulation, three high-performance distribution channels.
                </p>
              </div>

              <div className="flex flex-col gap-8 opacity-0 animate-fade-in-up delay-150">
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-[#0077B5] rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <LinkedInIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-1">
                      LinkedIn Adaptation
                    </h3>
                    <p className="text-sm text-foreground/50 font-medium leading-normal">
                      Professional, authoritative articles designed to build
                      high-level thought leadership within your industry
                      network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-foreground/5 text-foreground rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <XIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-1">
                      X (Twitter) Adaptation
                    </h3>
                    <p className="text-sm text-foreground/50 font-medium leading-normal">
                      Punchy, high-engagement threads that distill complex
                      topics into viral, snackable insights for your social
                      following.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    <EmailIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight mb-1">
                      Newsletter Curation
                    </h3>
                    <p className="text-sm text-foreground/50 font-medium leading-normal">
                      Direct audience outreach via curated summaries that drive
                      traffic back to your core content hubs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-border mt-auto bg-secondary/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-bold tracking-tighter">Fetemi.</div>
          <p className="text-[10px] text-foreground/30 font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Fetemi Engine • Accelerated Identity
          </p>
        </div>
      </footer>
    </div>
  );
}
