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
// import { SimulationModal } from "@/components/features/initialize/SimulationModal";
import { Toast } from "@/components/ui/toast";
import Loader from "@/components/ui/loader";

// type Status = "pending" | "loading" | "completed" | "error";

// interface Step {
//   id: number;
//   label: string;
//   status: Status;
// }

// const INITIAL_STEPS: Step[] = [
//   { id: 1, label: "Process initiated", status: "pending" },
//   { id: 2, label: "Ideas summarized", status: "pending" },
//   { id: 3, label: "Article 1 generated", status: "pending" },
//   { id: 4, label: "Image 1 generated", status: "pending" },
//   { id: 5, label: "Article 2 generated", status: "pending" },
//   { id: 6, label: "Image 2 generated", status: "pending" },
//   { id: 7, label: "Article 3 generated", status: "pending" },
//   { id: 8, label: "Image 3 generated", status: "pending" },
//   { id: 9, label: "Ready for review", status: "pending" },
// ];

export default function InitializePage() {
  const [inputType, setInputType] = useState<"url" | "idea">("url");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  // const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const validate = (value: string, type: "url" | "idea") => {
    if (!value.trim()) return "This field is required.";

    if (type === "url") {
      const urlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
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

  // const runWorkflow = async () => {
  //   const jobId = crypto.randomUUID();

  //   // 1. Reset steps and immediately set the first step to loading
  //   // setSteps(
  //   //   INITIAL_STEPS.map((s) =>
  //   //     s.id === 1 ? { ...s, status: "loading" } : { ...s, status: "pending" },
  //   //   ),
  //   // );
  //   // setShowModal(true);

  //   try {
  //     // 2. The initial handshake with your server
  //     const response = await fetch("/api/workflow/generate-drafts", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         id: jobId,
  //         action: "generate_drafts",
  //         type: inputType,
  //         data: inputValue,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Workflow failed to start");
  //     }

  //     // 3. Response is OK: Step 1 is done, Step 2 starts loading
  //     // setSteps((prev) =>
  //     //   prev.map((step) => {
  //     //     if (step.id === 1) return { ...step, status: "completed" };
  //     //     if (step.id === 2) return { ...step, status: "loading" };
  //     //     return step;
  //     //   }),
  //     // );

  //     // 4. Start listening for the remaining steps (3 through 9)
  //     // const eventSource = new EventSource(
  //     //   `/api/workflow/stream?jobId=${jobId}`,
  //     // );

  //     // eventSource.onmessage = (event) => {
  //     //   const { stepId, status } = JSON.parse(event.data);

  //     //   setSteps((prev) =>
  //     //     prev.map((step) => {
  //     //       // 1. If n8n says this specific step failed
  //     //       if (step.id === stepId && status === "error") {
  //     //         eventSource.close(); // Stop listening
  //     //         return { ...step, status: "error" };
  //     //       }

  //     //       // 2. If the step completed successfully
  //     //       if (step.id === stepId) {
  //     //         return { ...step, status: "completed" };
  //     //       }

  //     //       // 3. Set the NEXT step to loading ONLY if current didn't error
  //     //       if (step.id === stepId + 1 && status !== "error") {
  //     //         return { ...step, status: "loading" };
  //     //       }

  //     //       return step;
  //     //     }),
  //     //   );

  //     //   if (stepId === 9 || status === "error") {
  //     //     eventSource.close();
  //     //   }
  //     // };

  //     // eventSource.onerror = () => {
  //     //   eventSource.close();
  //     //   // set current loading step to error
  //     // };
  //   } catch (error: unknown) {
  //     // Set the current loading step to error status
  //     // setSteps((prev) =>
  //     //   prev.map((step) =>
  //     //     step.status === "loading" ? { ...step, status: "error" } : step,
  //     //   ),
  //     // );
  //     throw error;
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate(inputValue, inputType);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const jobId = crypto.randomUUID();
    localStorage.setItem("fetemi_seed_idea", inputValue);
    localStorage.setItem("fetemi_drafts_ready", "true");
    try {
      const response = await fetch("/api/workflow/generate-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: jobId,
          action: "generate_drafts",
          type: inputType,
          data: inputValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Workflow failed to start");
      }

      setInputValue("");
      setToast({
        type: "success",
        title: "Success",
        message: "Workflow started! This may take up to 5mins",
      });
    } catch (error: unknown) {
      setToast({
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (error) setError(null);
  };

  const handleTypeSwitch = (type: "url" | "idea") => {
    setInputType(type);
    if (error) setError(null);
  };

  // const resetPipeline = () => {
  //   setShowModal(false);
  //   setCurrentStepIndex(-1);
  //   setSteps(INITIAL_STEPS);
  // };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden transition-all">
        <header className="fixed top-0 w-full z-100 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-primary transition-colors group cursor-pointer text-foreground"
            >
              <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight text-sm">
                Return Home
              </span>
            </Link>
            <nav className="flex items-center gap-6">
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
              {typeof window !== "undefined" &&
                localStorage.getItem("fetemi_drafts_ready") === "true" && (
                  <Link
                    href="/review"
                    className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                  >
                    Review
                  </Link>
                )}
              <ThemeToggle />
              <div className="text-xl font-bold tracking-tighter">Fetemi.</div>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12">
          <div className="w-full max-w-2xl flex flex-col gap-10">
            <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-center">
                Start the{" "}
                <span className="text-primary underline decoration-white/10 underline-offset-8">
                  Engine.
                </span>
              </h1>
              <p className="text-base md:text-lg text-foreground/60 font-medium leading-relaxed text-center max-w-xl mx-auto">
                Give Fetemi a reference point. A published article to analyze,
                or a raw idea to develop — the multi-agent pipeline handles the
                rest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-fade-in-up delay-75">
              <div
                onClick={() => {
                  setInputType("url");
                  setError(null);
                }}
                className={`p-6 border rounded-3xl flex items-start gap-5 cursor-pointer transition-all duration-300 group ${
                  inputType === "url"
                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-secondary/30 border-white/5 hover:border-primary/20 hover:bg-secondary/40"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
                    inputType === "url"
                      ? "bg-primary/20 text-primary scale-110"
                      : "bg-primary/10 text-primary group-hover:scale-105"
                  }`}
                >
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-sm font-black uppercase tracking-tight transition-colors ${
                      inputType === "url" ? "text-primary" : ""
                    }`}
                  >
                    URL Extraction
                  </h3>
                  <p className="text-sm text-foreground/40 leading-snug font-medium mt-1">
                    Paste a published article or web page. Fetemi will analyze
                    and extract the core themes.
                  </p>
                </div>
              </div>

              <div
                onClick={() => {
                  setInputType("idea");
                  setError(null);
                }}
                className={`p-6 border rounded-3xl flex items-start gap-5 cursor-pointer transition-all duration-300 group ${
                  inputType === "idea"
                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-secondary/30 border-white/5 hover:border-primary/20 hover:bg-secondary/40"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 ${
                    inputType === "idea"
                      ? "bg-foreground/20 text-foreground scale-110"
                      : "bg-foreground/10 text-foreground group-hover:scale-105"
                  }`}
                >
                  <LightbulbIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-sm font-black uppercase tracking-tight transition-colors ${
                      inputType === "idea" ? "text-foreground" : ""
                    }`}
                  >
                    Seed Idea
                  </h3>
                  <p className="text-sm text-foreground/40 leading-snug font-medium mt-1">
                    Describe the angle or insight you want Fetemi to research
                    and build into full content.
                  </p>
                </div>
              </div>
            </div>

            <div className="opacity-0 animate-fade-in-up delay-150">
              <div className="bg-secondary/40 border border-white/10 rounded-4xl p-8 md:p-10 shadow-2xl backdrop-blur-sm gpu">
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

        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* <SimulationModal
          isOpen={showModal}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onReset={resetPipeline}
        /> */}
      </div>
    </AuthGuard>
  );
}
