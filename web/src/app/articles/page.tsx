"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import { DraftCard } from "@/components/ui/draft-card";
import CloseIcon from "@mui/icons-material/Close";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import { Toast } from "@/components/ui/toast";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  source: string; // Original seed idea
  created_at: string;
}

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const fetchApprovedArticles = async () => {
    setFetching(true);

    try {
      const response = await fetch("/api/articles/approved");
      const data = await response.json();

      if (response.ok) {
        setArticles(data.articles);
      }
    } catch (error) {
      setToast({
        type: "error",
        title: "Approval Error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchApprovedArticles();
    })();
  }, []);

  return (
    <AuthGuard>
      {fetching ? (
        <Loader text="Fetching Archive..." />
      ) : (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
          <header className="fixed top-0 w-full z-150 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
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
                  href="/initialize"
                  className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Initialize
                </Link>
                <Link
                  href="/articles"
                  className="text-xs font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-2"
                >
                  Articles
                </Link>
                <Link
                  href="/posts"
                  className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Posts
                </Link>
                <ThemeToggle />
                <div className="text-xl font-bold tracking-tighter">
                  Fetemi.
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 opacity-0 animate-fade-in-up">
                <div className="flex flex-col gap-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    Article{" "}
                    <span className="text-primary underline decoration-white/10 underline-offset-4">
                      Archive.
                    </span>
                  </h1>
                  <p className="text-lg text-foreground/60 font-medium max-w-xl leading-relaxed">
                    A curated history of every approved editorial draft.
                  </p>
                </div>

                {/* <div className="relative group max-w-md w-full">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-secondary border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                  />
                </div> */}
              </div>

              {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((a, idx) => (
                    <div key={a.id} className="relative group">
                      <DraftCard
                        {...a}
                        index={idx}
                        onClick={() => setSelectedArticle(a)}
                      />
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <SearchIcon className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">
                    No articles found
                  </h3>
                  <p className="text-foreground/40 max-w-xs mx-auto">
                    {searchQuery
                      ? "Try adjusting your search terms or filters."
                      : "You haven't approved any articles yet."}
                  </p>
                </div>
              )}
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
          {selectedArticle && (
            <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl animate-fade-in gpu">
              <div className="max-w-5xl w-full max-h-[90vh] bg-secondary border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative opacity-0 animate-fade-in-up">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 z-60 w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-red-500 text-foreground hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-sm border border-white/5 gpu"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                  <div className="relative w-full h-64 md:h-80 grayscale hover:grayscale-0 transition-all duration-1000">
                    <Image
                      src={selectedArticle.image_url}
                      alt={selectedArticle.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-secondary via-transparent to-transparent" />
                  </div>

                  <div className="p-8 md:p-16 flex flex-col gap-10 max-w-4xl mx-auto -mt-20 relative z-10">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                          Archived Draft
                        </span>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                          Stored{" "}
                          {new Date(
                            selectedArticle.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
                        {selectedArticle.title}
                      </h2>
                      <div className="h-1.5 w-24 bg-primary rounded-full shadow-lg shadow-primary/20" />
                    </div>

                    {/* Seed Idea Reference */}
                    <div className="bg-background/40 border border-white/5 rounded-3xl p-8 flex flex-col gap-4 backdrop-blur-md">
                      <div className="flex items-center gap-2 text-primary">
                        <LightbulbIcon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Original Reference
                        </span>
                      </div>
                      <p className="text-lg font-medium text-foreground/60 italic leading-relaxed">
                        &quot;
                        {selectedArticle.source ||
                          "No original reference point captured for this legacy draft."}
                        &quot;
                      </p>
                    </div>

                    <div className="flex flex-col gap-8 text-foreground/70 leading-relaxed font-medium text-lg md:text-xl">
                      {selectedArticle.body
                        .split("\n\n")
                        .map((para: string, i: number) => (
                          <div key={i}>
                            {para.startsWith("##") ? (
                              <h4 className="text-2xl md:text-3xl font-black mt-10 text-foreground tracking-tight border-l-4 border-primary pl-6 py-1">
                                {para.replace("## ", "")}
                              </h4>
                            ) : para.startsWith("###") ? (
                              <h5 className="text-xl md:text-2xl font-black mt-4 mb-2 text-foreground/90 italic">
                                {para.replace("### ", "")}
                              </h5>
                            ) : (
                              <p className="animate-fade-in">{para}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AuthGuard>
  );
}
