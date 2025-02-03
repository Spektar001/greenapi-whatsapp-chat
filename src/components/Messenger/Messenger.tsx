"use client";

import { useEffect, useState } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import RightPanel from "../RightPanel/RightPanel";
import styles from "./messenger.module.css";

export interface Message {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date | undefined;
}

export interface Chat {
  phone: string;
  messages: Message[];
  lastText: {
    text: string;
    timestamp?: Date;
    isSent?: boolean;
  };
}

type MessengerProps = {
  isAuthorized: boolean;
  idInstance: string;
  apiTokenInstance: string;
};

const Messenger = ({ isAuthorized, idInstance, apiTokenInstance }: MessengerProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthorized) return;
    const interval = setInterval(startPolling, 5000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const startPolling = async () => {
    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`
      );

      const data = await response.json();

      if (!data || !data.receiptId || !data.body) {
        console.warn("No new messages");
        return;
      }

      if (data.body.typeWebhook === "incomingMessageReceived") {
        const messageText = data.body.messageData?.textMessageData?.textMessage;
        const phone = data.body.senderData.sender.replace(/@c\.us$/, "");

        if (messageText) {
          addMessageToChat(phone, {
            id: data.body.idMessage,
            text: messageText,
            isSent: false,
            timestamp: new Date(),
          });
        }
      }

      await fetch(
        `https://7105.api.greenapi.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${data.receiptId}`,
        { method: "DELETE" }
      );
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  };

  const addMessageToChat = (phone: string, message: Message) => {
    setChats((prev) => {
      const existingChat = prev.find((chat) => chat.phone === phone);
      if (existingChat) {
        return prev.map((chat) =>
          chat.phone === phone
            ? {
                ...chat,
                messages: [...chat.messages, message],
                lastText: {
                  timestamp: message.timestamp,
                  text: message.text,
                  isSent: message.isSent,
                },
              }
            : chat
        );
      } else {
        return [
          ...prev,
          {
            phone,
            messages: [message],
            lastText: {
              timestamp: message.timestamp,
              text: message.text,
              isSent: message.isSent,
            },
          },
        ];
      }
    });
  };

  return (
    <div className={styles["app-container"]}>
      <LeftPanel
        chats={chats}
        setChats={setChats}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />
      <RightPanel
        chats={chats}
        selectedChat={selectedChat}
        addMessageToChat={addMessageToChat}
        idInstance={idInstance}
        apiTokenInstance={apiTokenInstance}
      />
    </div>
  );
};

export default Messenger;
