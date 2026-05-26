import { useCallback } from "react";
import { useResumeSession } from "./hooks/useResumeSession";
import Toolbar from "./components/layout/Toolbar";
import CompositionPane from "./components/layout/CompositionPane";
import PreviewPane from "./components/layout/PreviewPane";

function App() {
  const session = useResumeSession();
  const { reset } = session;

  const handleReset = useCallback(() => {
    if (window.confirm("Reset all selections? This cannot be undone.")) {
      reset();
    }
  }, [reset]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      <Toolbar
        onReset={handleReset}
        onExport={session.export}
        isExporting={session.isExporting}
      />
      <main className="flex flex-1 min-h-0 overflow-hidden">
        <CompositionPane session={session} />
        <PreviewPane session={session} />
      </main>
    </div>
  );
}

export default App;
