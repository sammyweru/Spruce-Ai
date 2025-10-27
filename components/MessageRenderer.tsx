
import React from 'react';

interface MessageRendererProps {
  text: string;
}

const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

const MessageRenderer: React.FC<MessageRendererProps> = ({ text }) => {
  const parts = text.split(markdownLinkRegex);

  return (
    <div className="text-sm space-y-2 prose prose-sm max-w-none prose-a:text-teal-600 hover:prose-a:text-teal-500">
      {parts.map((part, index) => {
        if (index % 3 === 1) { // This is link text
          const url = parts[index + 1];
          return (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
        if (index % 3 === 2) { 
          return null; // This is a URL, we already handled it.
        }
        
        // This is regular text, render with markdown-like formatting
        return part.split('\n').map((line, lineIndex) => {
            if (line.startsWith('### ')) return <h3 key={`${index}-${lineIndex}`} className="font-bold text-lg mt-4 mb-2">{line.substring(4)}</h3>
            if (line.startsWith('## ')) return <h2 key={`${index}-${lineIndex}`} className="font-bold text-xl mt-6 mb-3">{line.substring(3)}</h2>
            if (line.startsWith('* ')) return <li key={`${index}-${lineIndex}`} className="ml-4 list-disc">{line.substring(2)}</li>
            return <p key={`${index}-${lineIndex}`}>{line}</p>
        });

      })}
    </div>
  );
};

export default MessageRenderer;
