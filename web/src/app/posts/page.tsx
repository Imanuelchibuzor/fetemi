"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import XIcon from "@mui/icons-material/X";
import MailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PublishIcon from "@mui/icons-material/Publish";
import EventIcon from "@mui/icons-material/Event";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import Loader from "@/components/ui/loader";
import { Toast } from "@/components/ui/toast";
import { ScheduleModal } from "@/components/ui/schedule-modal";

interface Post {
  id: string;
  subject: string;
  image_url?: string;
  type: "linkedin" | "x" | "newsletter";
  body: string;
  status: "published" | "scheduled" | "pending";
  created_at: string;
  article_id: string;
}

const TYPE_ICONS = {
  linkedin: <LinkedInIcon className="w-4 h-4" />,
  x: <XIcon className="w-4 h-4" />,
  newsletter: <MailIcon className="w-4 h-4" />,
};

const STATUS_COLORS = {
  published: "bg-green-500/10 text-green-500 border-green-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function PostsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState(selectedPost?.body);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const fetchPosts = async () => {
    setFetching(true);

    try {
      const res = await fetch("/api/posts");
      const data = await res.json();

      if (res.ok) {
        setPosts(data);
      }
    } catch (error) {
      setToast({
        type: "error",
        title: "Fetch Error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPosts();
    })();
  }, []);

  const filteredPosts =
    filterType === "all"
      ? posts
      : posts.filter((p: Post) => p.type === filterType);

  useEffect(() => {
    setEditedContent(selectedPost?.body);
    setIsEditing(false);
  }, [selectedPost]);

  const handlePublish = async () => {
    setPublishing(true);

    try {
      await fetch("/api/workflow/publish-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPost?.id,
          body: editedContent,
          subject: selectedPost?.subject || "",
          type: selectedPost?.type,
        }),
      });

      setToast({
        type: "success",
        title: "Triggered!",
        message: `The post is being published.`,
      });
      setSelectedPost(null);
    } catch (error) {
      setToast({
        type: "error",
        title: "Publishing Failed",
        message: error instanceof Error ? error.message : "Network error",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AuthGuard>
      {fetching ? (
        <Loader text="Fetching Posts" />
      ) : (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
          <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
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
                  className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Articles
                </Link>
                <Link
                  href="/posts"
                  className="text-xs font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-2"
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
                    Content{" "}
                    <span className="text-primary underline decoration-white/10 underline-offset-4">
                      Distribution.
                    </span>
                  </h1>
                  <p className="text-lg text-foreground/60 font-medium max-w-xl leading-relaxed">
                    Monitor the lifecycle of your content across every platform.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-secondary border border-white/5 rounded-2xl p-1 shadow-inner">
                  {["all", "linkedin", "x", "newsletter"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                        filterType === type
                          ? "bg-primary text-white shadow-lg"
                          : "text-foreground/40 hover:text-foreground/80 hover:bg-white/5"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-secondary/60">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                          Post
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                          Channel
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                          Status
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 text-right">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts &&
                        filteredPosts.map((post: Post) => (
                          <tr
                            key={post.id}
                            onClick={() => {
                              setSelectedPost(post);
                              console.log(post);
                            }}
                            className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                          >
                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-1 max-w-md">
                                <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                  {post.body.replace(/<[^>]*>?/gm, "")}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center bg-background rounded-lg border border-white/5">
                                  {
                                    TYPE_ICONS[
                                      post.type.toLowerCase() as keyof typeof TYPE_ICONS
                                    ]
                                  }
                                </div>
                                <span className="text-xs font-bold tracking-tight opacity-60">
                                  {post.type.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[post.status]}`}
                              >
                                {post.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className="text-xs font-medium tracking-tight opacity-40">
                                {new Date(post.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  },
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {filteredPosts?.length === 0 && (
                  <div className="py-24 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                      <FilterListIcon className="w-6 h-6 opacity-20" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2">
                      No posts found
                    </h3>
                    <p className="text-foreground/30 text-xs font-medium max-w-60 leading-relaxed">
                      Try changing your filters or check back after approving
                      more articles.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.4em]">
                  Fetemi Editorial System • End of Data
                </p>
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

          {/* Post Detail Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl animate-fade-in gpu">
              <div className="max-w-4xl w-full max-h-[90vh] bg-secondary border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative opacity-0 animate-fade-in-up">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 right-6 z-60 w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-red-500 text-foreground hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-sm border border-white/5 gpu"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>

                <div className="p-10 md:p-12 flex flex-col gap-8 overflow-y-auto no-scrollbar scroll-smooth">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-background rounded-2xl border border-white/5 text-primary">
                        {
                          TYPE_ICONS[
                            selectedPost.type.toLowerCase() as keyof typeof TYPE_ICONS
                          ]
                        }
                      </div>
                    </div>
                    {selectedPost?.status === "pending" && (
                      <div className="flex items-center gap-3 z-50 bg-background/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                            isEditing
                              ? "bg-primary text-white"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          {isEditing ? (
                            <SaveIcon className="w-3.5 h-3.5" />
                          ) : (
                            <EditIcon className="w-3.5 h-3.5" />
                          )}
                          {isEditing ? "Done" : "Edit Draft"}
                        </button>
                      </div>
                    )}
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[selectedPost.status]}`}
                    >
                      {selectedPost.status}
                    </span>
                  </div>

                  <div className="bg-background/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                    {isEditing ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full min-h-[90vh] bg-secondary/30 border border-white/5 p-8 rounded-4xl text-foreground/90 font-medium text-lg md:text-xl leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    ) : (
                      <div
                        className="text-lg font-medium text-foreground/80 leading-relaxed whitespace-pre-wrap selection:bg-primary/30"
                        dangerouslySetInnerHTML={{
                          __html: editedContent ?? "",
                        }}
                      />
                    )}
                  </div>

                  {/* Conditional Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {selectedPost.status === "pending" && (
                      <>
                        <button
                          className="flex-1 py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl text-xs uppercase tracking-widest"
                          onClick={handlePublish}
                          disabled={publishing}
                        >
                          <PublishIcon className="w-4 h-4" />
                          {publishing ? "Publishing..." : "Publish Now"}
                        </button>
                        <button
                          className="flex-1 py-4 bg-white/5 text-foreground font-black border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest"
                          onClick={() => setIsScheduleOpen(true)}
                        >
                          <EventIcon className="w-4 h-4" />
                          Schedule
                        </button>
                      </>
                    )}
                    {selectedPost.status === "scheduled" && (
                      <button className="w-full py-4 bg-primary/10 text-primary font-black border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest">
                        <EditCalendarIcon className="w-4 h-4" />
                        Edit Schedule Timeline
                      </button>
                    )}
                    {selectedPost.status === "published" && (
                      <div className="w-full py-4 bg-green-500/10 text-green-500 font-black border border-green-500/20 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                        <CheckCircleIcon className="w-4 h-4" />
                        Live on {selectedPost.type}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isScheduleOpen && selectedPost && (
            <ScheduleModal
              post={selectedPost}
              onClose={() => setIsScheduleOpen(false)}
              onSuccess={() => {
                fetchPosts(); // Refresh your list to show the "Scheduled" badge
                setToast({
                  type: "success",
                  title: "Scheduled!",
                  message: `The post has been scheduled successfully.`,
                });
              }}
            />
          )}
        </div>
      )}
    </AuthGuard>
  );
}
