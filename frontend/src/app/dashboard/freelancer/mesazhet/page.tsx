"use client";

import { Suspense } from "react";
import { MessagingInbox } from "@/components/MessagingInbox";

export default function FreelancerMessagesPage() {
  return (
    <Suspense fallback={<div className="text-stone">Po ngarkohet…</div>}>
      <MessagingInbox basePath="/dashboard/freelancer/mesazhet" />
    </Suspense>
  );
}
