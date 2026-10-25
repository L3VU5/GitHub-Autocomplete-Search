// Marks the first occurrence of `term` inside `text`, ignoring case.
export default function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim();
  const start = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1;
  if (start === -1) return <>{text}</>;

  const end = start + needle.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-brand-500/30 px-0.5 text-white">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}
