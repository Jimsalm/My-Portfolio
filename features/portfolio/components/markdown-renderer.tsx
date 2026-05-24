import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const CodeBlock = dynamic(() => import("@/features/portfolio/components/code-block").then((mod) => mod.CodeBlock), {
  loading: () => <code className="block animate-pulse border bg-[#111] p-4 font-mono text-sm text-white">loading code...</code>,
  ssr: false,
});

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), ["target"], ["rel"], ["className"]],
    code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
  },
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ children, ...props }) => (
          <a className="border-b border-foreground font-medium" rel="noreferrer" target="_blank" {...props}>
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-foreground pl-5 font-mono text-muted-foreground">{children}</blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.startsWith("language-");
          return isBlock ? (
            <CodeBlock>{children}</CodeBlock>
          ) : (
            <code className="border bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
          );
        },
        h1: ({ children }) => <h1 className="font-mono text-4xl font-semibold tracking-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-10 font-mono text-3xl font-semibold tracking-tight">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-8 font-mono text-2xl font-semibold tracking-tight">{children}</h3>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        p: ({ children }) => <p className="font-mono text-sm leading-8 text-muted-foreground">{children}</p>,
        pre: ({ children }) => <pre className="my-6 overflow-x-auto">{children}</pre>,
        ul: ({ children }) => <ul className="ml-5 list-disc space-y-2 font-mono text-sm text-muted-foreground">{children}</ul>,
      }}
      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
    >
      {content}
    </ReactMarkdown>
  );
}
