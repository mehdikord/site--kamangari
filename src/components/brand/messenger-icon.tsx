import { cn } from "cn";

const PATHS: Record<string, string> = {
  telegram: "M21.9 4.3 18.6 19.6c-.2 1.1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.1l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20.6 2.4c.9-.3 1.7.2 1.3 1.9Z",
  whatsapp: "M12 1.8A10 10 0 0 0 3.4 17L2 22.2l5.3-1.4A10 10 0 1 0 12 1.8Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-3.7-1.2-6.1-4.4-6.7-5.2-.6-.8-1.4-2.4-.6-3.9.6-1 1.7-1.3 2.1-.6l.9 2.1c.2.4-.1.7-.7 1.4.9 1.6 2.2 2.8 4 3.6.7-.8.9-1.1 1.3-1l2.2 1.1c.4.2.5.5.4 1.2Z",
  instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm5.2-3.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
};

export function MessengerIcon({ id, label, className }: { id: string; label: string; className?: string }) {
  if (!PATHS[id]) return <span className={cn("heading text-xs leading-none whitespace-nowrap", className, "w-auto")} aria-hidden="true">{label}</span>;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className={cn("size-5", className)} aria-hidden="true">
      <path d={PATHS[id]} />
    </svg>
  );
}
