// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <a
      href="#"
      onClick={() => signOut()} // Remove callbackUrl
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Log Out
    </a>
  );
};

export default LogoutButton;
