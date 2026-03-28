import { useState } from "react";
import { Toast } from "./toast";

interface Post {
  id: string;
  subject: string;
  image_url?: string;
  type: "linkedin" | "x" | "newsletter";
  body: string;
  status: "published" | "processing" | "scheduled" | "pending";
  created_at: string;
  article_id: string;
}

interface ScheduleModalProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleModal = ({
  post,
  onClose,
  onSuccess,
}: ScheduleModalProps) => {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const handleSchedule = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/schedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: date }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Scheduling failed", error);
      setToast({
        type: "error",
        title: "Publishing Failed",
        message: error instanceof Error ? error.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1000  bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-auto max-w-md shadow-2xl">
        <h2 className="text-xl font-semibold mb-2">Schedule Post</h2>
        <p className="text-gray-400 text-sm mb-6">
          Set a date and time to automatically publish your{" "}
          <strong>{post.type.toUpperCase()}</strong> post.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Prevents past dates
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={!date || loading}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium transition-all"
            >
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
