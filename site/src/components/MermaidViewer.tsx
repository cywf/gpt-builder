import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  diagrams: Array<{ name: string; content: string }>;
}

export default function MermaidViewer({ diagrams }: MermaidViewerProps) {
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#16213e',
          primaryColor: '#667eea',
          primaryTextColor: '#fff',
          primaryBorderColor: '#764ba2',
          lineColor: '#48bb78',
          secondaryColor: '#764ba2',
          tertiaryColor: '#48bb78',
        },
      });
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (!initialized || !containerRef.current || diagrams.length === 0) return;

    const renderDiagram = async () => {
      try {
        const diagram = diagrams[selectedDiagram];
        const { svg } = await mermaid.render('mermaid-diagram', diagram.content);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="alert alert-error">
              <span>Failed to render diagram. Please check the syntax.</span>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [initialized, selectedDiagram, diagrams]);

  if (diagrams.length === 0) {
    return (
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>No diagrams found. Diagrams will be extracted from the README.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Diagram selector */}
      {diagrams.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {diagrams.map((diagram, index) => (
            <button
              key={index}
              className={`btn btn-sm ${selectedDiagram === index ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedDiagram(index)}
            >
              {diagram.name}
            </button>
          ))}
        </div>
      )}

      {/* Diagram container */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">{diagrams[selectedDiagram].name}</h3>
          <div
            ref={containerRef}
            className="mermaid-container min-h-[400px] flex items-center justify-center"
          />
        </div>
      </div>

      {/* Source code */}
      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title text-lg font-medium">View Mermaid Source</summary>
        <div className="collapse-content">
          <pre className="bg-base-300 p-4 rounded overflow-x-auto">
            <code>{diagrams[selectedDiagram].content}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}
