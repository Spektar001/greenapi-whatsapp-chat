import Auth from "@/components/Auth/Auth";

export default function Home() {
  return <Auth />;
}



// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import styles from "./messenger.module.css";

// interface Message {
//   id: string;
//   text: string;
//   isSent: boolean;
//   timestamp: Date | undefined;
// }

// interface Chat {
//   phone: string;
//   messages: Message[];
//   lastText: {
//     text: string;
//     timestamp?: Date;
//     isSent?: boolean;
//   };
// }

// interface Credentials {
//   idInstance: string;
//   apiTokenInstance: string;
// }

// const Messenger = () => {
//   const [credentials, setCredentials] = useState<Credentials>({
//     idInstance: "7105184863",
//     apiTokenInstance: "4d63abc2d7924e32a3b09857ad72d992fedc435ddb704e6ca3",
//   });
//   const [newPhone, setNewPhone] = useState("");
//   const [newMessage, setNewMessage] = useState("");
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);
//   const [showAddChat, setShowAddChat] = useState(false);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const lastMessageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setTimeout(() => {
//       lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   }, [chats, selectedChat]);

//   useEffect(() => {
//     if (!isAuthorized) return;
//     const interval = setInterval(startPolling, 5000);
//     return () => clearInterval(interval);
//   }, [isAuthorized]);

//   const handleAuth = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsAuthorized(true);
//   };

//   const startPolling = async () => {
//     try {
//       const response = await fetch(
//         `https://7105.api.greenapi.com/waInstance${credentials.idInstance}/ReceiveNotification/${credentials.apiTokenInstance}`
//       );

//       const data = await response.json();

//       if (!data || !data.receiptId || !data.body) {
//         console.warn("No new messages");
//         return;
//       }

//       if (data.body.typeWebhook === "incomingMessageReceived") {
//         const messageText = data.body.messageData?.textMessageData?.textMessage;
//         const phone = data.body.senderData.sender.replace(/@c\.us$/, "");

//         if (messageText) {
//           addMessageToChat(phone, {
//             id: data.body.idMessage,
//             text: messageText,
//             isSent: false,
//             timestamp: new Date(),
//           });
//         }
//       }

//       await fetch(
//         `https://7105.api.greenapi.com/waInstance${credentials.idInstance}/DeleteNotification/${credentials.apiTokenInstance}/${data.receiptId}`,
//         { method: "DELETE" }
//       );
//     } catch (error) {
//       console.error("Error polling messages:", error);
//     }
//   };

//   const addMessageToChat = (phone: string, message: Message) => {
//     setChats((prev) => {
//       const existingChat = prev.find((chat) => chat.phone === phone);
//       if (existingChat) {
//         return prev.map((chat) =>
//           chat.phone === phone
//             ? {
//                 ...chat,
//                 messages: [...chat.messages, message],
//                 lastText: {
//                   timestamp: message.timestamp,
//                   text: message.text,
//                   isSent: message.isSent,
//                 },
//               }
//             : chat
//         );
//       } else {
//         return [
//           ...prev,
//           {
//             phone,
//             messages: [message],
//             lastText: {
//               timestamp: message.timestamp,
//               text: message.text,
//               isSent: message.isSent,
//             },
//           },
//         ];
//       }
//     });
//   };

//   const createChat = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newPhone) return;

//     setChats((prev) => [
//       ...prev,
//       {
//         phone: newPhone,
//         messages: [],
//         lastText: {
//           text: newMessage,
//         },
//       },
//     ]);
//     setSelectedChat(newPhone);
//     setNewPhone("");
//     setShowAddChat(false);
//   };

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       const response = await fetch(
//         `https://7105.api.greenapi.com/waInstance${credentials.idInstance}/SendMessage/${credentials.apiTokenInstance}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             chatId: `${selectedChat}@c.us`,
//             message: newMessage,
//           }),
//         }
//       );

//       if (response.ok) {
//         addMessageToChat(selectedChat, {
//           id: Date.now().toString(),
//           text: newMessage,
//           isSent: true,
//           timestamp: new Date(),
//         });
//         setNewMessage("");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (!isAuthorized) {
//     return (
//       <div className={styles["auth-container"]}>
//         <div className={styles.title}>
//           <Image src={"/logo-48.svg"} width={48} height={48} alt={"logo"} />
//           <h1>WhatsApp Chat</h1>
//         </div>
//         <form onSubmit={handleAuth}>
//           <input
//             type="text"
//             placeholder="ID Instance"
//             value={credentials.idInstance}
//             onChange={(e) =>
//               setCredentials((prev) => ({
//                 ...prev,
//                 idInstance: e.target.value,
//               }))
//             }
//             required
//           />
//           <input
//             type="text"
//             placeholder="API Token Instance"
//             value={credentials.apiTokenInstance}
//             onChange={(e) =>
//               setCredentials((prev) => ({
//                 ...prev,
//                 apiTokenInstance: e.target.value,
//               }))
//             }
//             required
//           />
//           <button className={styles.loginBtn} type="submit">
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className={styles["app-container"]}>
//       <div className={styles["left-panel"]}>
//         <button
//           className={styles["new-chat-button"]}
//           onClick={() => setShowAddChat(true)}
//         >
//           New Chat
//         </button>

//         {showAddChat && (
//           <div className={styles["modal-overlay"]}>
//             <div className={styles["modal-content"]}>
//               <form onSubmit={createChat}>
//                 <input
//                   type="tel"
//                   placeholder="Phone number"
//                   value={newPhone}
//                   onChange={(e) =>
//                     setNewPhone(e.target.value.replace(/\D/g, ""))
//                   }
//                   required
//                 />
//                 <div className={styles["modal-buttons"]}>
//                   <button
//                     className={styles["modal-buttons-start"]}
//                     disabled={newPhone && newPhone.trim() ? false : true}
//                     type="submit"
//                   >
//                     Start Chat
//                   </button>
//                   <button
//                     className={styles["modal-buttons-cancel"]}
//                     type="button"
//                     onClick={() => setShowAddChat(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className={styles["chat-list"]}>
//           {chats.map((chat) => (
//             <div
//               key={chat.phone}
//               className={`${styles["chat-item"]} ${
//                 selectedChat === chat.phone ? styles.selected : ""
//               }`}
//               onClick={() => setSelectedChat(chat.phone)}
//             >
//               +{chat.phone}
//               <div className={styles.lastMessage}>
//                 <p key={Math.random()}>
//                   {chat.lastText.text ? chat.lastText.text : "Say hi!"}
//                 </p>
//                 <span>
//                   {chat.lastText.timestamp?.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={styles["right-panel"]}>
//         {selectedChat ? (
//           <>
//             <div className={styles["chat-header"]}>
//               Chat with +{selectedChat}
//             </div>
//             <div className={styles["messages-container"]}>
//               {chats
//                 .find((c) => c.phone === selectedChat)
//                 ?.messages.map((message) => (
//                   <div
//                     key={`${
//                       message.id
//                     }|${message.timestamp?.getMilliseconds()}|${
//                       Math.random() * Math.PI
//                     }`}
//                     className={`${styles.message} ${
//                       message.isSent ? styles.sent : styles.received
//                     }`}
//                   >
//                     <div
//                       ref={lastMessageRef}
//                       className={styles["message-content"]}
//                     >
//                       <p className={styles.textMessage}>{message.text}</p>
//                       <span className={styles["timestamp"]}>
//                         {message.timestamp?.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//             <form className={styles["message-textarea"]} onSubmit={sendMessage}>
//               <textarea
//                 value={newMessage}
//                 aria-invalid={false}
//                 rows={2}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage(e);
//                   }
//                 }}
//                 placeholder="Type a message here..."
//               />
//               <button
//                 className={styles.sendBtn}
//                 disabled={newMessage && newMessage.trim() ? false : true}
//                 type="submit"
//               >
//                 <Image src={"/send.svg"} width={28} height={28} alt={"send"} />
//               </button>
//             </form>
//           </>
//         ) : (
//           <div className={styles["no-chat-selected"]}>
//             Select a chat or start a new one
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Messenger;
