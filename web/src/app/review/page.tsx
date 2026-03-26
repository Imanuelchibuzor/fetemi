"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ThemeToggle } from "@/components/theme-toggle";
import { DraftCard } from "@/components/ui/draft-card";
import { DraftPreviewModal } from "@/components/ui/draft-preview-modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { AuthGuard } from "@/components/auth-guard";
import { Toast } from "@/components/ui/toast";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
}

export default function ReviewPage() {
  const router = useRouter();

  const [jobId, setJobId] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<
    number | null
  >(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("jobId");
    setJobId(savedId);
  }, []);

  const fetchArticles = useCallback(async () => {
    if (!jobId) return;
    setFetching(true);

    try {
      const response = await fetch(`/api/articles/${jobId}`);
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.log(error);
      setToast({
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setFetching(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) setFetching(true);
    fetchArticles();
  }, [jobId, fetchArticles]);

  const selectedArticle =
    selectedArticleIndex !== null ? articles?.[selectedArticleIndex] : null;

  const handleNext = () => {
    if (
      selectedArticleIndex !== null &&
      articles &&
      selectedArticleIndex < articles.length - 1
    ) {
      setSelectedArticleIndex(selectedArticleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedArticleIndex !== null && articles && selectedArticleIndex > 0) {
      setSelectedArticleIndex(selectedArticleIndex - 1);
    }
  };

  const handleApproveDraft = (updatedArticle: Article) => {
    if (!articles) return;
    const newArticles = [...articles];
    newArticles[selectedArticleIndex!] = updatedArticle;
    setArticles(newArticles);
    setShowConfirm(true);
  };

  const handleFinalConfirm = async () => {
    if (selectedArticleIndex === null || !articles) return;

    const articleToApprove = articles[selectedArticleIndex];
    setConfirming(true);

    try {
      const response = await fetch("/api/articles/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleToApprove.id,
          body: articleToApprove.body,
          image: articleToApprove.image_url,
        }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Failed to approve article");

      setToast({
        type: "success",
        title: "Success",
        message: "Article approved! Generating social media posts...",
      });

      setSelectedArticleIndex(null);
      localStorage.removeItem("jobId");
      router.push("/articles")
    } catch (error) {
      setToast({
        type: "error",
        title: "Approval Error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setConfirming(false);
      setShowConfirm(false);
    }
  };

  return (
    <AuthGuard>
      {fetching ? (
        <Loader text="Fetching Drafts..." />
      ) : (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
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
                <Link
                  href="/review"
                  className="text-xs font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-2"
                >
                  Review
                </Link>
                <ThemeToggle />
                <div className="text-xl font-bold tracking-tighter">
                  Fetemi.
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:gap-12 md:gap-20">
              <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                  Editorial{" "}
                  <span className="text-primary underline decoration-white/10 underline-offset-4">
                    Review.
                  </span>
                </h1>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <p className="text-lg text-foreground/60 font-medium max-w-2xl leading-relaxed">
                    These unique drafts have been generated based on your input.
                    Review the formatting, imagery, and tone before final
                    distribution.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="/articles"
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                    >
                      View Archive
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles &&
                  articles.map((article, idx) => (
                    <DraftCard
                      key={article.id}
                      {...article}
                      index={idx}
                      onClick={() => setSelectedArticleIndex(idx)}
                    />
                  ))}
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

          {/* Article Detail Modal */}
          {selectedArticle && articles && (
            <DraftPreviewModal
              article={selectedArticle}
              onClose={() => setSelectedArticleIndex(null)}
              onApprove={handleApproveDraft}
              onNext={handleNext}
              onPrev={handlePrev}
              hasPrev={selectedArticleIndex! > 0}
              hasNext={selectedArticleIndex! < articles.length - 1}
            />
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleFinalConfirm}
            confirming={confirming}
            title="Finalize Editorial Draft?"
            description={`You are about to approve "${selectedArticle?.title}" for LinkedIn, X, and Newsletter content generation.`}
          />
        </div>
      )}
    </AuthGuard>
  );
}
