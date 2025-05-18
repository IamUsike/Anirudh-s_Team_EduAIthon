"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Content({ content, title }) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // If content is already HTML, use it directly
    if (content && content.includes("<")) {
      setHtmlContent(content);
    } else if (content) {
      // Otherwise, treat it as markdown
      setHtmlContent(content);
    }
  }, [content]);

  if (!content) {
    return (
      <div className="w-full md:w-3/4 p-6 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">
            Select a lesson to begin
          </h3>
          <p className="text-gray-500 mt-2">
            Choose a lesson from the sidebar to start learning
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="prose max-w-none">
        <ReactMarkdown>{htmlContent}</ReactMarkdown>
      </div>
    </div>
  );
}
