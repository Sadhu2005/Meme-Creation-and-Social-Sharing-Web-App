"use client";

import { useState } from "react";

interface RecoveryKeyBoxProps {
  recoveryKey: string;
}

export function RecoveryKeyBox({ recoveryKey }: RecoveryKeyBoxProps) {
  const [copied, setCopied] = useState(false);

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback for older browsers */
      const input = document.createElement("textarea");
      input.value = recoveryKey;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <p className="flex-1 rounded-2xl bg-[var(--color-surface)] px-4 py-4 text-center font-mono text-base tracking-wider break-all sm:text-lg">
        {recoveryKey}
      </p>
      <button
        type="button"
        onClick={copyKey}
        className="shrink-0 rounded-2xl border border-black/10 bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {copied ? "Copied!" : "Copy key"}
      </button>
    </div>
  );
}
