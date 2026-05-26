import ResumePreview from "../preview/ResumePreview";

export default function PreviewPane({ session }) {
  return (
    <section
      aria-label="Resume preview"
      className="w-[45%] min-h-0 overflow-auto bg-preview-bg p-6"
    >
      <ResumePreview session={session} />
    </section>
  );
}
