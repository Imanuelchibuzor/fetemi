"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import MailIcon from "@mui/icons-material/Mail";
import SendIcon from "@mui/icons-material/Send";

type Status = "pending" | "loading" | "completed" | "error";

interface PublishingStatusStepProps {
  label: string;
  status: Status;
  isCurrent: boolean;
}

export function PublishingStatusStep({ label, status, isCurrent }: PublishingStatusStepProps) {
  const getIcon = () => {
    const l = label.toLowerCase();
    if (l.includes("linkedin")) return <LinkedInIcon className="w-4 h-4 text-[#0077B5]" />;
    if (l.includes("x adaptation") || l.includes("x publishing")) return <XIcon className="w-3.5 h-3.5 text-foreground" />;
    if (l.includes("newsletter") || l.includes("news letter")) return <MailIcon className="w-4 h-4 text-primary" />;
    if (l.includes("process initiated")) return <SendIcon className="w-4 h-4 opacity-50" />;
    if (l.includes("completed")) return <CheckCircleIcon className="w-4 h-4 text-accent" />;
    return null;
  };

  return (
    <div
      className={`flex items-center gap-4 transition-all duration-500 ${!isCurrent && status === "pending" ? "opacity-20 translate-x-2" : "opacity-100 translate-x-0"
        }`}
    >
      <div className="shrink-0">
        {status === "completed" && <CheckCircleIcon className="w-6 h-6 text-accent" />}
        {status === "loading" && <HourglassTopIcon className="w-6 h-6 text-primary animate-spin" />}
        {status === "error" && <ErrorOutlineIcon className="w-6 h-6 text-red-500" />}
        {status === "pending" && <div className="w-6 h-6 rounded-full border-2 border-border" />}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`font-bold tracking-tight text-sm ${status === "completed" ? "text-foreground" :
          status === "loading" ? "text-primary" :
            status === "error" ? "text-red-500" : "text-foreground/40"
          }`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[10px] font-medium opacity-30">
            {status === "completed" ? "Generated" : status === "loading" ? "Generating" : status === "error" ? "Failed" : "Waiting"}
          </span>
        </div>
      </div>
    </div>
  );
}
