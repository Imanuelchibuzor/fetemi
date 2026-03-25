"use client";

import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

interface DraftPreviewModalProps {
  article: Article;
  onClose: () => void;
  onApprove: () => void;
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

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [article.id]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-lg animate-fade-in gpu">
      <div className="max-w-5xl w-full max-h-[90vh] bg-secondary border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative opacity-0 animate-fade-in-up">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50">
          <button
            disabled={!hasPrev}
            onClick={onPrev}
            className="w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-primary text-foreground rounded-full transition-all cursor-pointer backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none shadow-xl border border-white/5 active:scale-95 gpu"
          >
            <ArrowBackIosNewIcon className="w-5 h-5 mr-0.5" />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-50">
          <button
            disabled={!hasNext}
            onClick={onNext}
            className="w-12 h-12 flex items-center justify-center bg-background/80 hover:bg-primary text-foreground rounded-full transition-all cursor-pointer backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none shadow-xl border border-white/5 active:scale-95 gpu"
          >
            <ArrowForwardIosIcon className="w-5 h-5 ml-0.5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center bg-background/80 hover:bg-red-500 text-foreground hover:text-white rounded-full transition-all cursor-pointer backdrop-blur-sm border border-white/5 gpu"
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
              src={article.image}
              alt={article.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="eager"
              fill
              priority
            />
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

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
                {article.title}
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>

            <div className="flex flex-col gap-8 text-foreground/80 leading-relaxed font-medium text-lg md:text-xl selection:bg-primary selection:text-white">
              {article.content.split("\n\n").map((para, i) => (
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
                    <p className="">{para}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 mt-12 py-10 border-t border-border">
              <button
                onClick={onApprove}
                className="px-10 py-5 bg-accent text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xl shadow-accent/40 text-sm uppercase tracking-[0.2em]"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Approve & Finalize
              </button>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">
                Ready for Omnichannel Distribution
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
