// app/page.jsx
"use client";

import Pagee from "./page";
import { UserProvider } from "./Provider";
// import Pagee from "./Pagee"; // your actual page component

export default function Page() {
  return (
    <UserProvider>
      <Pagee />
    </UserProvider>
  );
}
