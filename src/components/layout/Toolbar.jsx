export default function Toolbar({ onReset, onExport, isExporting }) {
  return (
    <header className="flex items-center justify-between h-11 px-4 bg-base border-b border-border-default shrink-0">
      <span className="text-sm font-medium text-text-primary tracking-tight">
        Resume Builder
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          disabled={isExporting}
          className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-md hover:bg-elevated transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↺ Reset
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          aria-busy={isExporting}
          className="px-3 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? "Exporting…" : "Export .docx"}
        </button>
      </div>
    </header>
  );
}
