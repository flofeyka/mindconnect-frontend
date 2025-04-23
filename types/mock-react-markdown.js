import React from "react";

export default function ReactMarkdown({ children, ...props }) {
  return <div {...props} dangerouslySetInnerHTML={{ __html: children }} />;
}
