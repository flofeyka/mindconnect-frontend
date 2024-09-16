"use client";
import { Textarea, Button } from "@nextui-org/react";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import Message from "./Messges";
import { useRef } from "react";

export default function Home() {
  const { messages, handleSubmit, input, handleInputChange } = useChat();
  const formRef = useRef<HTMLFormElement>(null);

  // Track textarea height
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Max height for textarea
  const MAX_HEIGHT = 200; // Example: 200px max height

  // Auto-resize function for textarea
  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT); // Limit to max height
      textareaRef.current.style.height = `${newHeight}px`; // Set height based on content, limited by max height
    }
  };

  return (
    <div className="container h-full w-full flex flex-col py-8">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-auto relative">
        <Textarea
          ref={textareaRef} // Add ref to textarea
          style={{
            fontSize: "1rem",
            resize: "none",
            overflowY: "auto",
            paddingRight: "90px",
          }} // Disable manual resize and add auto scrolling
          label="Question"
          placeholder="Ask a question"
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            handleResize(); // Call resize function on input change
          }}
          minRows={1}
          className="w-full px-7 py-2 "
        />
        <Button
          type="submit"
          disabled={!input}
          className="absolute top-1/2 transform -translate-y-1/2 right-9 rounded-full cursor-pointer"
        >
          <Send size={24} />
        </Button>
      </form>
    </div>
  );
}
