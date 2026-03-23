"use client";

import { useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkIcon from "@mui/icons-material/Link";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import { StrategyToggle } from "@/components/features/initialize/StrategyToggle";
import { WorkflowInput } from "@/components/features/initialize/WorkflowInput";
import { SimulationModal } from "@/components/features/initialize/SimulationModal";

type Status = "pending" | "loading" | "completed" | "error";

interface Step {
  id: number;
  label: string;
  status: Status;
}

const INITIAL_STEPS: Step[] = [
  { id: 1, label: "Process initiated", status: "pending" },
  { id: 2, label: "Ideas summarized", status: "pending" },
  { id: 3, label: "Article 1 generated", status: "pending" },
  { id: 4, label: "Image 1 generated", status: "pending" },
  { id: 5, label: "Article 2 generated", status: "pending" },
  { id: 6, label: "Image 2 generated", status: "pending" },
  { id: 7, label: "Article 3 generated", status: "pending" },
  { id: 8, label: "Image 3 generated", status: "pending" },
  { id: 9, label: "Ready for review", status: "pending" },
];

export default function InitializePage() {
  const [inputType, setInputType] = useState<"url" | "idea">("url");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const validate = (value: string, type: "url" | "idea") => {
    if (!value.trim()) return "This field is required.";

    if (type === "url") {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(value)) {
        return "Please enter a valid URL (e.g., https://example.com)";
      }
    } else {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/;
      if (urlRegex.test(value)) {
        return "This looks like a URL. Please switch to URL mode or provide a text description.";
      }
      if (value.length < 10) {
        return "Please provide a more detailed idea (at least 10 characters).";
      }
    }
    return null;
  };

  const runSimulation = async () => {
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: "pending" })));
    setShowModal(true);

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      setCurrentStepIndex(i);
      setSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: "loading" } : step
      ));

      const delay = 800 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      if (Math.random() < 0.05 && i > 2 && i < 8) {
        setSteps(prev => prev.map((step, idx) =>
          idx === i ? { ...step, status: "error" } : step
        ));
        return;
      }

      setSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: "completed" } : step
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(inputValue, inputType);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    await runSimulation();
    setIsSubmitting(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (error) setError(null);
  };

  const handleTypeSwitch = (type: "url" | "idea") => {
    setInputType(type);
    if (error) setError(null);
  };

  const resetPipeline = () => {
    setShowModal(false);
    setCurrentStepIndex(-1);
    setSteps(INITIAL_STEPS);
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden transition-all">
        <header className="fixed top-0 w-full z-[100] bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors group cursor-pointer text-foreground">
              <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight text-sm">Return Home</span>
            </Link>
            <nav className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-xl font-bold tracking-tighter">Fetemi.</div>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12">
          <div className="w-full max-w-2xl flex flex-col gap-10">
            <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-center">
                Start the <span className="text-primary underline decoration-white/10 underline-offset-8">Engine.</span>
              </h1>
              <p className="text-base md:text-lg text-foreground/60 font-medium leading-relaxed text-center max-w-xl mx-auto">
                Give Fetemi a reference point. A published article to analyze, or a raw idea to develop — the multi-agent pipeline handles the rest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-fade-in-up delay-75">
              <div
                onClick={() => { setInputType("url"); setError(null); }}
                className={`p-6 border rounded-3xl flex items-start gap-5 cursor-pointer transition-all duration-300 group ${
                  inputType === "url"
                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-secondary/30 border-white/5 hover:border-primary/20 hover:bg-secondary/40"
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
                  inputType === "url" ? "bg-primary/20 text-primary scale-110" : "bg-primary/10 text-primary group-hover:scale-105"
                }`}>
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${
                    inputType === "url" ? "text-primary" : ""
                  }`}>URL Extraction</h3>
                  <p className="text-[10px] text-foreground/40 leading-snug font-medium mt-1">Paste a published article or web page. Fetemi will analyze and extract the core themes.</p>
                </div>
              </div>

              <div
                onClick={() => { setInputType("idea"); setError(null); }}
                className={`p-6 border rounded-3xl flex items-start gap-5 cursor-pointer transition-all duration-300 group ${
                  inputType === "idea"
                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-secondary/30 border-white/5 hover:border-primary/20 hover:bg-secondary/40"
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
                  inputType === "idea" ? "bg-foreground/20 text-foreground scale-110" : "bg-foreground/10 text-foreground group-hover:scale-105"
                }`}>
                  <LightbulbIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${
                    inputType === "idea" ? "text-foreground" : ""
                  }`}>Seed Idea</h3>
                  <p className="text-[10px] text-foreground/40 leading-snug font-medium mt-1">Describe the angle, insight, or argument you want Fetemi to research and build into full content.</p>
                </div>
              </div>
            </div>

            <div className="opacity-0 animate-fade-in-up delay-[150ms]">
              <div className="bg-secondary/40 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-sm gpu">
                <div className="flex flex-col gap-8">
                  <StrategyToggle
                    inputType={inputType}
                    onTypeSwitch={handleTypeSwitch}
                  />
                  <WorkflowInput
                    inputType={inputType}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    error={error}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <SimulationModal
          isOpen={showModal}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onReset={resetPipeline}
        />
      </div>
    </AuthGuard>
  );
}
