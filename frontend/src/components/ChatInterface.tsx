import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { ChatMessage, ChatMessageData } from "./ChatMessage";

interface ChatInterfaceProps {
  messages: ChatMessageData[];
  onSendMessage: (message: string) => void;
  userType: "patient" | "expert";
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  userType,
  isLoading,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to MedChat AI
                </h3>
                <p className="text-gray-600 mb-4">
                  {userType === "expert"
                    ? "Ask about the latest medical research, clinical trials, and treatment guidelines."
                    : "Ask questions about medical conditions, treatments, or find relevant clinical trials."}
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Try asking:</p>
                  <div className="space-y-1">
                    {userType === "expert" ? (
                      <>
                        <p>
                          • "Latest trials for immunotherapy in
                          lung cancer"
                        </p>
                        <p>
                          • "Recent breakthroughs in Alzheimer's
                          treatment"
                        </p>
                        <p>
                          • "New guidelines for diabetes
                          management"
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          • "What are the treatment options for
                          Type 2 diabetes?"
                        </p>
                        <p>
                          • "Are there clinical trials for my
                          condition?"
                        </p>
                        <p>
                          • "Side effects of common blood
                          pressure medications"
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userType={userType}
              />
            ))
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="sm" className="mb-2">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder={`Ask about medical topics${userType === "expert" ? ", research, or clinical trials" : " or find treatments"}...`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] max-h-[120px] resize-none pr-12"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="absolute right-2 bottom-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="mb-2">
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          MedChat AI can make mistakes. Please verify important
          medical information with healthcare professionals.
        </p>
      </div>
    </div>
  );
}