"use client";

function highlightLine(line: string) {
  const parts = line.split(/(\b(?:const|let|function|return|import|from|export|type|interface|async|await)\b|"[^"]*"|'[^']*'|\/\/.*)/g);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    const className =
      /^(const|let|function|return|import|from|export|type|interface|async|await)$/.test(part)
        ? "text-foreground"
        : /^["']/.test(part)
          ? "text-zinc-300"
          : /^\/\//.test(part)
            ? "text-zinc-500"
            : "text-zinc-400";

    return (
      <span className={className} key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const code = String(children).replace(/\n$/, "");

  return (
    <code className="block overflow-x-auto border bg-[#050505] p-4 font-mono text-sm leading-7 text-zinc-400">
      {code.split("\n").map((line, index) => (
        <span className="block" key={`${line}-${index}`}>
          <span className="mr-4 select-none text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
          {highlightLine(line)}
        </span>
      ))}
    </code>
  );
}
