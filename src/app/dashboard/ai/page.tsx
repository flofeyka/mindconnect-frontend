"use client";
import {
  Textarea,
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  useDisclosure,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import { useChat } from "ai/react";
import { Delete, DeleteIcon, Send, Trash } from "lucide-react";
import Messages from "./MessageItem";
import { useEffect, useRef, useState } from "react";
import { GigaChatAPI } from "@lib/API/gigachatAPI";
import { ChatDialog } from "@lib/types";
import CustomModal from "@components/CustomModal";
import CustomButton from "@components/CustomButton";

export interface Message {
  id: string;
  content: string;
  role: string;
}

export default function Home() {
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

  const [messageInput, setMessageInput] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [dialogs, setDialogs] = useState<ChatDialog[]>([]);
  const [selectedDialog, setSelectedDialog] = useState<ChatDialog | null>(null);

  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    setMessageLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: messageInput } as Message,
    ]);
    setMessageInput("");
    containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
    let dialog = selectedDialog;
    if (!selectedDialog) {
      dialog = await createDialog(messageInput);
      console.log("selected dialog");
    }

    console.log(selectedDialog);
    const data = await GigaChatAPI.sendMessage(dialog!.id, messageInput);

    setMessageLoading(false);
    setMessages((prev) => [...prev, data]);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [selectedDialog?.id, messageLoading]);

  const createDialog = async (title: string) => {
    const data = await GigaChatAPI.createDialog({ title });
    if (data) {
      console.log(data);
      setDialogs((prev) => [...prev, data]);
      setSelectedDialog(data);
    }

    return data;
  };

  const [isDialogsLoading, setIsDialogsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchDialogs = async () => {
      setIsDialogsLoading(true);
      const data = await GigaChatAPI.getDialogs();

      setDialogs(data);
      setIsDialogsLoading(false);
      if (!selectedDialog) {
        setSelectedDialog(data[0]);
      }
    };

    fetchDialogs();
  }, []);

  const [isAllMessagesLoading, setIsAllMessagesLoading] =
    useState<boolean>(false);
  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]);
      setIsAllMessagesLoading(false);
      if (selectedDialog?.id) {
        const data = await GigaChatAPI.getMessages(selectedDialog.id);
        setMessages(data);
      }
      setIsAllMessagesLoading(true);
    };

    fetchMessages();
  }, [selectedDialog?.id]);

  return (
    <div className="container h-full w-full flex py-8 gap-5">
      <Card className="p-3 w-[35%] flex flex-col gap-3">
        <div className="w-full">
          <Button
            className="px-2 w-full"
            onPress={() => {
              setSelectedDialog(null);
              setMessages([]);
            }}
          >
            Создать диалог
          </Button>
        </div>
        <div className="space-y-2 overflow-y-auto px-2 h-full">
          {isDialogsLoading ? (
            <Spinner className="flex justify-self-center w-full h-full items-center" />
          ) : (
            dialogs.map((dialog) => (
              <div
                onClick={() => setSelectedDialog(dialog)}
                className={`w-full ${
                  selectedDialog?.id === dialog.id
                    ? "bg-gray-800"
                    : "hover:bg-gray-600 "
                } cursor-pointer transition-all flex justify-between text-ellipsis overflow-hidden px-2 items-center rounded-xl py-2.5`}
                key={dialog.id}
              >
                <span className="text-ellipsis overflow-hidden mr-3 break-keep text-nowrap">
                  {dialog.title}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="hover:bg-danger-400 z-10 transition-all p-2 rounded-full"
                >
                  <Trash size={15} />
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
      <div className="container h-full w-full flex flex-col">
        <Card ref={containerRef} className="flex-1 overflow-y-auto">
          {isAllMessagesLoading ? (
            messages.map((message, index: number) => (
              <Messages key={index} message={message} />
            ))
          ) : (
            <Spinner className="w-full h-full flex justify-self-center items-center" />
          )}
          {messageLoading && <Spinner className="flex justify-self-center" />}
        </Card>
        <div className="mt-3 w-full gap-2 flex items-center">
          <Textarea
            ref={textareaRef} // Add ref to textarea
            style={{
              fontSize: "1rem",
              resize: "none",
              overflowY: "auto",
            }} // Disable manual resize and add auto scrolling
            placeholder="Спросите что-нибудь"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleResize(); // Call resize function on input change
            }}
            minRows={1}
            className="w-full"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!messageInput.trim()}
            className="rounded-full cursor-pointer placeholder:items-center bg-[#252525] flex justify-center items-center p-2 pr-3 hover:bg-[#353535]"
          >
            <Send size={22} className="rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
