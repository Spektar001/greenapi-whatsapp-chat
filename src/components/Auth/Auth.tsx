"use client";

import Image from "next/image";
import { useState } from "react";
import Messenger from "../Messenger/Messenger";
import styles from "./auth.module.css";

interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

const Auth = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    idInstance: "",
    apiTokenInstance: "",
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorized(true);
  };

  return !isAuthorized ? (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-title"]}>
        <Image src={"/logo-48.svg"} width={48} height={48} alt={"logo"} />
        <h1>WhatsApp Chat</h1>
      </div>
      <form onSubmit={handleAuth}>
        <input
          type="text"
          placeholder="ID Instance"
          value={credentials.idInstance}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              idInstance: e.target.value,
            }))
          }
          required
        />
        <input
          type="text"
          placeholder="API Token Instance"
          value={credentials.apiTokenInstance}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              apiTokenInstance: e.target.value,
            }))
          }
          required
        />
        <button className={styles["auth-loginBtn"]} type="submit">
          Login
        </button>
      </form>
    </div>
  ) : (
    <Messenger
      isAuthorized={isAuthorized}
      idInstance={credentials.idInstance}
      apiTokenInstance={credentials.apiTokenInstance}
    />
  );
};

export default Auth;
