"use client";

import { useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import MailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PublishIcon from "@mui/icons-material/Publish";
import EventIcon from "@mui/icons-material/Event";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";

interface Post {
  id: string;
  articleId: number;
  articleTitle: string;
  type: "LinkedIn" | "X" | "Newsletter";
  content: string;
  status: "Published" | "Scheduled" | "Pending Review";
  date: string;
}

const TYPE_ICONS = {
  LinkedIn: <LinkedInIcon className="w-4 h-4" />,
  X: <XIcon className="w-4 h-4" />,
  Newsletter: <MailIcon className="w-4 h-4" />
};

const STATUS_COLORS = {
  "Published": "bg-green-500/10 text-green-500 border-green-500/20",
  "Scheduled": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Pending Review": "bg-amber-500/10 text-amber-500 border-amber-500/20"
};



export default function PostsPage() {
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("fetemi_posts") || "[]");
      if (saved.length > 0) {
        return saved.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      
      // Mock data for demo if empty
      return [
        {
          id: "1",
          articleId: 1,
          articleTitle: "Perspectives and How They Shape Our Lives",
          type: "LinkedIn",
          content: "Check out my latest thoughts on perspective and how it frames our entire experience of reality. <b>Perspective is everything.</b> #Mindset #Growth",
          status: "Published",
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "2",
          articleId: 1,
          articleTitle: "Perspectives and How They Shape Our Lives",
          type: "X",
          content: "Why perspective matters more than we think. 🧵<br/><br/>1/ Two people can see the same event differently.<br/>2/ Our history shapes our lens.<br/>3/ We can choose our frame.",
          status: "Scheduled",
          date: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: "3",
          articleId: 2,
          articleTitle: "The Architecture of Perception",
          type: "Newsletter",
          content: "Deep dive into the patterns of thinking. In this edition, we explore how cognitive structuralism defines our day-to-day engagement with the world around us.",
          status: "Pending Review",
          date: new Date().toISOString()
        }
      ];
    }
    return [];
  });

  const filteredPosts = filterType === "All" 
    ? posts 
    : posts.filter((p: Post) => p.type === filterType);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors group cursor-pointer text-foreground">
              <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight text-sm">Return Home</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/articles" className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Articles</Link>
              <Link href="/posts" className="text-xs font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-2">Posts</Link>
              {typeof window !== "undefined" && localStorage.getItem("fetemi_drafts_ready") === "true" && (
                <Link href="/review" className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Review</Link>
              )}
              <ThemeToggle />
              <div className="text-xl font-bold tracking-tighter">Fetemi.</div>
            </nav>
          </div>
        </header>

        <main className="flex-1 pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 opacity-0 animate-fade-in-up">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                  Content <span className="text-primary underline decoration-white/10 underline-offset-4">Distribution.</span>
                </h1>
                <p className="text-lg text-foreground/60 font-medium max-w-xl leading-relaxed">
                  Monitor the lifecycle of your content across every platform. Filter by channel, status, and timeline.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-secondary border border-white/5 rounded-2xl p-1 shadow-inner">
                {["All", "LinkedIn", "X", "Newsletter"].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
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
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Article Link</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Channel</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post: Post) => (
                      <tr 
                        key={post.id} 
                        onClick={() => setSelectedPost(post)}
                        className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1 max-w-md">
                            <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                              {post.articleTitle}
                            </span>
                            <span className="text-[10px] font-medium text-foreground/30 truncate">
                              {post.content.replace(/<[^>]*>?/gm, '')}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-background rounded-lg border border-white/5">
                              {TYPE_ICONS[post.type]}
                            </div>
                            <span className="text-xs font-bold tracking-tight opacity-60">{post.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[post.status]}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-xs font-medium tracking-tight opacity-40">
                             {new Date(post.date).toLocaleDateString('en-US', { 
                               month: 'short', 
                               day: 'numeric', 
                               year: 'numeric' 
                             })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-24 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                    <FilterListIcon className="w-6 h-6 opacity-20" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2">No posts found</h3>
                  <p className="text-foreground/30 text-xs font-medium max-w-[240px] leading-relaxed">
                    Try changing your filters or check back after approving more articles.
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

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl animate-fade-in gpu">
            <div className="max-w-2xl w-full bg-secondary border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative opacity-0 animate-fade-in-up">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-red-500 text-foreground hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-sm border border-white/5 gpu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <div className="p-10 md:p-12 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-background rounded-2xl border border-white/5 text-primary">
                      {TYPE_ICONS[selectedPost.type]}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black tracking-tighter">{selectedPost.type} Adaptation</h3>
                      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Post ID: {selectedPost.id}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[selectedPost.status]}`}>
                    {selectedPost.status}
                  </span>
                </div>

                <div className="bg-background/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                   <div 
                     className="text-lg font-medium text-foreground/80 leading-relaxed whitespace-pre-wrap selection:bg-primary/30"
                     dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                   />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-20 px-2">
                    <span>Target Article</span>
                    <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground/60 px-2 truncate">{selectedPost.articleTitle}</p>
                </div>

                {/* Conditional Action Buttons */}
                <div className="flex gap-3 mt-4">
                  {selectedPost.status === "Pending Review" && (
                    <>
                      <button className="flex-1 py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl text-xs uppercase tracking-widest">
                        <PublishIcon className="w-4 h-4" />
                        Publish Now
                      </button>
                      <button className="flex-1 py-4 bg-white/5 text-foreground font-black border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest">
                        <EventIcon className="w-4 h-4" />
                        Schedule
                      </button>
                    </>
                  )}
                  {selectedPost.status === "Scheduled" && (
                    <button className="w-full py-4 bg-primary/10 text-primary font-black border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest">
                      <EditCalendarIcon className="w-4 h-4" />
                      Edit Schedule Timeline
                    </button>
                  )}
                  {selectedPost.status === "Published" && (
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
      </div>
    </AuthGuard>
  );
}
