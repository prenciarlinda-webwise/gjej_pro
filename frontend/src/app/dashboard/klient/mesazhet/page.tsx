"use client";

import { Suspense } from "react";
import { MessagingInbox } from "@/components/MessagingInbox";

export default function KlientMessagesPage() {
  return (
    <Suspense fallback={<div className="text-stone">Po ngarkohet…</div>}>
      <MessagingInbox basePath="/dashboard/klient/mesazhet" />
    </Suspense>
  );
}
