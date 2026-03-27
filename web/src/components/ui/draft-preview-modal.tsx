import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
}

interface DraftPreviewModalProps {
  article: Article;
  onClose: () => void;
  onApprove: (updatedArticle: Article) => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function DraftPreviewModal({
  article,
  onClose,
  onApprove,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}: DraftPreviewModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(article.title);
  const [editedContent, setEditedContent] = useState(article.body);

  useEffect(() => {
    setEditedTitle(article.title);
    setEditedContent(article.body);
    setIsEditing(false);
  }, [article.id, article.title, article.body]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [article.id]);

  const handleApprove = () => {
    onApprove({
      ...article,
      title: editedTitle,
      body: editedContent
    });
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-lg animate-fade-in gpu">
      <div className="max-w-5xl w-full max-h-[90vh] bg-secondary border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative opacity-0 animate-fade-in-up">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50">
          <button
            disabled={!hasPrev}
            onClick={onPrev}
            className="w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-primary text-white rounded-full transition-all cursor-pointer backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none shadow-xl border border-white/5 active:scale-95 gpu"
          >
            <ArrowBackIosNewIcon className="w-5 h-5 mr-0.5" />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-50">
          <button
            disabled={!hasNext}
            onClick={onNext}
            className="w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-primary text-white rounded-full transition-all cursor-pointer backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none shadow-xl border border-white/5 active:scale-95 gpu"
          >
            <ArrowForwardIosIcon className="w-5 h-5 ml-0.5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-60 w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-red-500 text-foreground hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-sm border border-white/5 gpu"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Vertical Scrollable Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
        >
          <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          <div className="relative w-full h-64 md:h-96 grayscale hover:grayscale-0 transition-all duration-1000">
            <Image
              src={article.image_url}
              alt={article.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
              onLoadingComplete={(img) => img.classList.remove("opacity-0")}
              fill
              loading="eager"
              priority
            />

            {/* Action Bar Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 bg-background/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
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
          </div>

          <div className="p-8 md:p-16 flex flex-col gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Editorial Draft 0{article.id}
                </span>
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                  v2.4 Production Standard
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] text-foreground bg-secondary/50 border-b-4 border-primary p-4 rounded-t-2xl w-full focus:outline-none resize-none"
                  rows={2}
                />
              ) : (
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] text-foreground">
                  {editedTitle}
                </h2>
              )}
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>

            <div className="flex flex-col gap-8 text-foreground/80 leading-relaxed font-medium text-lg md:text-xl selection:bg-primary selection:text-white">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-125 bg-secondary/30 border border-white/5 p-8 rounded-4xl text-foreground/90 font-medium text-lg md:text-xl leading-relaxed focus:outline-none focus:border-primary/50 transition-colors"
                />
              ) : (
                editedContent
                  .split("\n\n")
                  .map((para, i) => (
                    <div key={i}>
                      {para.startsWith("##") ? (
                        <h4 className="text-xl md:text-2xl font-black mt-10 text-foreground tracking-tight border-l-4 border-primary pl-6 py-1">
                          {para.replace("## ", "")}
                        </h4>
                      ) : para.startsWith("###") ? (
                        <h5 className="text-lg md:text-xl font-black mt-4 mb-2 text-foreground/90 italic">
                          {para.replace("### ", "")}
                        </h5>
                      ) : (
                        <p className="">{para}</p>
                      )}
                    </div>
                  ))
              )}
            </div>

            <div className="flex flex-col items-center gap-6 mt-12 py-10 border-t border-border">
              <button
                onClick={handleApprove}
                className="px-10 py-5 bg-accent text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xl shadow-accent/40 text-sm uppercase tracking-[0.2em]"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Approve & Generate Posts
              </button>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">
                Ready for Omnichannel Generation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
