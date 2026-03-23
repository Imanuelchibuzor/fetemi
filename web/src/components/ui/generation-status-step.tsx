"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

type Status = "pending" | "loading" | "completed" | "error";

interface GenerationStatusStepProps {
  label: string;
  status: Status;
  isCurrent: boolean;
}

export function GenerationStatusStep({ label, status, isCurrent }: GenerationStatusStepProps) {
  const getIcon = () => {
    const l = label.toLowerCase();
    if (l.includes("process initiated")) return <PlayCircleIcon className="w-4 h-4 opacity-50" />;
    if (l.includes("ideas summarized")) return <AutoAwesomeIcon className="w-4 h-4 text-primary" />;
    if (l.includes("image")) return <ImageIcon className="w-4 h-4 text-foreground/50" />;
    if (l.includes("article")) return <ArticleIcon className="w-4 h-4 text-foreground/50" />;
    if (l.includes("ready")) return <TaskAltIcon className="w-4 h-4 text-accent" />;
    return null;
  };

  return (
    <div
      className={`flex items-center gap-4 transition-all duration-500 ${
        !isCurrent && status === "pending" ? "opacity-20 translate-x-2" : "opacity-100 translate-x-0"
      }`}
    >
      <div className="shrink-0">
        {status === "completed" && <CheckCircleIcon className="w-6 h-6 text-accent" />}
        {status === "loading" && <HourglassTopIcon className="w-6 h-6 text-primary animate-spin" />}
        {status === "error" && <ErrorOutlineIcon className="w-6 h-6 text-red-500" />}
        {status === "pending" && <div className="w-6 h-6 rounded-full border-2 border-border" />}
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className={`font-bold tracking-tight text-sm ${
            status === "completed" ? "text-foreground" :
            status === "loading" ? "text-primary" :
            status === "error" ? "text-red-500" : "text-foreground/40"
          }`}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[10px] font-medium opacity-30">
            {status === "completed" ? "Generated" : status === "loading" ? "Processing" : status === "error" ? "Failed" : "Waiting"}
          </span>
        </div>
      </div>
    </div>
  );
}
