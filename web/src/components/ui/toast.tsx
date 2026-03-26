import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void; // Added prop to handle closing
  duration?: number; // Optional: defaults to 3000ms
}

// Map the types to specific MUI icons and Tailwind classes
const toastConfig = {
  success: {
    Icon: CheckCircleIcon,
    iconColor: "text-accent",
    bgColor: "bg-accent/20",
  },
  error: {
    Icon: ErrorIcon,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/20",
  },
  warning: {
    Icon: WarningIcon,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/20",
  },
  info: {
    Icon: InfoIcon,
    iconColor: "text-primary",
    bgColor: "bg-primary/20",
  },
};

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 10000,
}) => {
  const { Icon, iconColor, bgColor } = toastConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clean up the timer if the component unmounts before the 3s is up
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-8 right-8 z-100 animate-fade-in-up">
      <div className="bg-secondary/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
        {/* Dynamic Icon Container */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} ${iconColor}`}
        >
          <Icon sx={{ fontSize: 20 }} />
        </div>

        {/* Text Content */}
        <div className="flex flex-col text-left">
          <span className="text-xs font-black uppercase tracking-widest leading-none">
            {title}
          </span>
          <span className="text-[10px] opacity-40 font-bold mt-1 uppercase tracking-widest">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};
