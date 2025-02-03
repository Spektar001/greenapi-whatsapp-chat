"use client";

import { useState } from "react";
import { Chat } from "../Messenger/Messenger";
import styles from "./leftPanel.module.css";

type LeftPanelProps = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
  selectedChat: string | null;
};

const LeftPanel = ({
  chats,
  setChats,
  setSelectedChat,
  selectedChat,
}: LeftPanelProps) => {
  const [newPhone, setNewPhone] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);

  const createChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone) return;

    setChats((prev) => [
      ...prev,
      { phone: newPhone, senderName: "", messages: [], lastText: { text: "" } },
    ]);
    setSelectedChat(newPhone);
    setNewPhone("");
    setShowAddChat(false);
  };

  return (
    <div className={styles["left-panel"]}>
      <button
        className={styles["new-chat-button"]}
        onClick={() => setShowAddChat(true)}
      >
        New Chat
      </button>

      {showAddChat && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <form onSubmit={createChat}>
              <input
                type="tel"
                placeholder="Phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                required
              />
              <div className={styles["modal-buttons"]}>
                <button
                  className={styles["modal-buttons-start"]}
                  type="submit"
                  disabled={!newPhone.trim()}
                >
                  Start Chat
                </button>
                <button
                  className={styles["modal-buttons-cancel"]}
                  type="button"
                  onClick={() => setShowAddChat(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles["chat-list"]}>
        {chats.map((chat) => (
          <div
            key={chat.phone}
            className={`${styles["chat-item"]} ${
              selectedChat === chat.phone ? styles.selected : ""
            }`}
            onClick={() => setSelectedChat(chat.phone)}
          >
            +{chat.phone}
            <div className={styles.lastMessage}>
              <p>{chat.lastText.text || "Say hi!"}</p>
              <span>
                {chat.lastText.timestamp?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
