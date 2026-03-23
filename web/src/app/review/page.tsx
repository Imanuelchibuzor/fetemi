"use client";

import { useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ThemeToggle } from "@/components/theme-toggle";
import { DraftCard } from "@/components/ui/draft-card";
import { DraftPreviewModal } from "@/components/ui/draft-preview-modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { PublishingStatusModal } from "@/components/ui/publishing-status-modal";
import { AuthGuard } from "@/components/auth-guard";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

type Status = "pending" | "loading" | "completed" | "error";

interface Step {
  id: number;
  label: string;
  status: Status;
}

const PUBLISHING_STEPS: Step[] = [
  { id: 1, label: "Process initiated", status: "pending" },
  { id: 2, label: "LinkedIn adaptation", status: "pending" },
  { id: 3, label: "LinkedIn publishing", status: "pending" },
  { id: 4, label: "X adaptation", status: "pending" },
  { id: 5, label: "X publishing", status: "pending" },
  { id: 6, label: "Newsletter adaptation", status: "pending" },
  { id: 7, label: "Newsletter publishing", status: "pending" },
  { id: 8, label: "Process completed", status: "pending" },
];

const PERSPECTIVES_CONTENT = `Perspectives are the lenses through which we interpret the world. They influence how we understand events, respond to challenges, relate to others, and make decisions. Though two people may experience the same situation, their perspectives can lead them to completely different conclusions. This simple truth makes perspective one of the most powerful forces shaping human life.

## The Meaning of Perspective

A perspective is not just an opinion. It is a pattern of thinking formed by our experiences, values, beliefs, culture, education, and emotions. From childhood, we begin collecting lessons that shape how we see ourselves and the world around us.

Because perspective is built over time, it often feels natural and unquestionable. We may assume that the way we see things is the only reasonable way. In reality, another person’s perspective may be equally valid, even if it is very different from our own.

## How Perspectives Influence Daily Life

Perspectives shape everyday choices in subtle but important ways. A student who sees failure as proof of inability may give up quickly, while another who sees failure as feedback may try again with more dedication.

Relationships are deeply affected by perspective. Misunderstandings often happen not because people lack care, but because they interpret the same words or actions differently.

Even emotional well-being is linked to perspective. A person who focuses only on what is missing may feel dissatisfaction, while someone who notices progress and small wins may remain hopeful.

## The Power of Changing Perspective

One of the most valuable human abilities is the capacity to change perspective. Life becomes richer when we step outside our assumptions and consider other viewpoints.

Changing perspective can reduce conflict, increase compassion, and lead to better decisions. What seems like resistance may actually be fear or confusion when viewed differently.

During hardship, perspective helps people discover resilience, strength, and purpose in moments they once considered unbearable.

## How to Develop a Healthier Perspective

Developing a healthier perspective begins with self-awareness. Reflection helps us separate fact from assumption.

Listening carefully to others expands our understanding. Reading widely and meeting people from different backgrounds also helps create balance in how we interpret the world.

Gratitude, patience, and humility support a wiser outlook and help us live with greater clarity and less judgment.

## Conclusion

Perspectives shape what we notice, how we interpret events, and how we treat ourselves and others. A broader perspective opens the door to empathy, resilience, and growth. Often, the quality of our lives depends not only on what happens to us, but on how we choose to see it.`;

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Perspectives and How They Shape Our Lives",
    excerpt: "The lenses through which we interpret the world influence how we understand events and make decisions.",
    content: PERSPECTIVES_CONTENT,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Architecture of Perception",
    excerpt: "Understanding the patterns of thinking formed by our experiences, values, and cultural education.",
    content: PERSPECTIVES_CONTENT,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Resilience through Reframing",
    excerpt: "Why the quality of our lives depends not only on what happens to us, but on how we choose to see it.",
    content: PERSPECTIVES_CONTENT,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
  }
];

export default function ReviewPage() {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPublishingModal, setShowPublishingModal] = useState(false);
  const [pubSteps, setPubSteps] = useState<Step[]>(PUBLISHING_STEPS);
  const [currentPubStepIndex, setCurrentPubStepIndex] = useState(-1);

  const selectedArticle = selectedArticleIndex !== null ? ARTICLES[selectedArticleIndex] : null;

  const handleNext = () => {
    if (selectedArticleIndex !== null && selectedArticleIndex < ARTICLES.length - 1) {
      setSelectedArticleIndex(selectedArticleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedArticleIndex !== null && selectedArticleIndex > 0) {
      setSelectedArticleIndex(selectedArticleIndex - 1);
    }
  };

  const handleConfirmPublishing = () => {
    setShowConfirm(false);
    setSelectedArticleIndex(null);
    setShowPublishingModal(true);
    simulatePublishing();
  };

  const simulatePublishing = async () => {
    setPubSteps(PUBLISHING_STEPS);
    setCurrentPubStepIndex(0);

    for (let i = 0; i < PUBLISHING_STEPS.length; i++) {
      setCurrentPubStepIndex(i);
      setPubSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: "loading" } : step
      ));

      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      setPubSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: "completed" } : step
      ));
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        <header className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-sm border-b border-white/10 gpu">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/initialize" className="flex items-center gap-2 hover:text-primary transition-colors group cursor-pointer text-foreground">
              <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight text-sm">Return to Pipeline</span>
            </Link>
            <nav className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-xl font-bold tracking-tighter">Fetemi.</div>
            </nav>
          </div>
        </header>

        <main className="flex-1 pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:gap-12 md:gap-20">
            
            <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Editorial <span className="text-primary underline decoration-white/10 underline-offset-4">Review.</span>
              </h1>
              <p className="text-lg text-foreground/60 font-medium max-w-2xl leading-relaxed">
                Three unique drafts have been generated based on your input. Review the formatting, imagery, and tone before final distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ARTICLES.map((article, idx) => (
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

        {/* Article Detail Modal */}
        {selectedArticle && (
          <DraftPreviewModal 
            article={selectedArticle}
            onClose={() => setSelectedArticleIndex(null)}
            onApprove={() => setShowConfirm(true)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasPrev={selectedArticleIndex! > 0}
            hasNext={selectedArticleIndex! < ARTICLES.length - 1}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal 
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmPublishing}
          title="Finalize Editorial Draft?"
          description={`You are about to approve "${selectedArticle?.title}" for distribution across all Fetemi channels.`}
        />

        {/* Publishing Pipeline Modal */}
        <PublishingStatusModal 
          isOpen={showPublishingModal}
          steps={pubSteps}
          currentStepIndex={currentPubStepIndex}
          resetPipeline={simulatePublishing}
        />
      </div>
    </AuthGuard>
  );
}
