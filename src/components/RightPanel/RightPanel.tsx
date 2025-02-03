"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Chat, Message } from "../Messenger/Messenger";
import styles from "./rightPanel.module.css";

type RightPanelProps = {
  chats: Chat[];
  selectedChat: string | null;
  addMessageToChat: (phone: string, message: Message) => void;
  idInstance: string;
  apiTokenInstance: string;
};
const RightPanel = ({
  chats,
  selectedChat,
  addMessageToChat,
  idInstance,
  apiTokenInstance,
}: RightPanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [chats, selectedChat]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: `${selectedChat}@c.us`,
            message: newMessage,
          }),
        }
      );

      if (response.ok) {
        addMessageToChat(selectedChat, {
          id: Date.now().toString(),
          text: newMessage,
          isSent: true,
          timestamp: new Date(),
        });
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles["right-panel"]}>
      {selectedChat ? (
        <>
          <div className={styles["chat-header"]}>Chat with +{selectedChat}</div>
          <div className={styles["messages-container"]}>
            {chats
              .find((c) => c.phone === selectedChat)
              ?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.isSent ? styles.sent : styles.received
                  }`}
                >
                  <div
                    ref={lastMessageRef}
                    className={styles["message-content"]}
                  >
                    <p>{message.text}</p>
                    <span className={styles["timestamp"]}>
                      {message.timestamp?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <form className={styles["message-textarea"]} onSubmit={sendMessage}>
            <textarea
              value={newMessage}
              rows={2}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type a message here..."
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={!newMessage.trim()}
            >
              <Image src={"/send.svg"} width={28} height={28} alt={"send"} />
            </button>
          </form>
        </>
      ) : (
        <div className={styles["no-chat-selected"]}>
          Select a chat or start a new one
        </div>
      )}
    </div>
  );
};

export default RightPanel;
