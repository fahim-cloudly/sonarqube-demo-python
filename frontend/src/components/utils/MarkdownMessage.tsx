import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm'

export const MarkdownMessage = ({ content }: { content: string }) => {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <Markdown
          components={{
            code(props) {
              const { children, className } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    borderRadius: '6px',
                    background: '#0f172a',
                    margin: '8px 0',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 text-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mb-2 text-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-md font-medium mb-2 text-foreground">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 text-foreground leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-2 space-y-1 text-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-2 space-y-1 text-foreground">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-foreground">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground mb-2">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-foreground">{children}</em>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-2">
                <table className="min-w-full border border-neutral-300 rounded-md">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-neutral-300 px-3 py-2 bg-muted/20 font-medium text-foreground">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-neutral-300 px-3 py-2 text-foreground">
                {children}
              </td>
            ),
          }}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </Markdown>
      </div>
    );
  };