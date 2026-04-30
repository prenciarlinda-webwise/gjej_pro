"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { tokenStore } from "@/lib/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8765/api";

export function AvatarUploader({
  name,
  currentUrl,
  onUploaded,
}: {
  name: string;
  currentUrl: string | null;
  onUploaded: (newUrl: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFile(file: File) {
    setError("");

    if (file.size > 5 * 1024 * 1024) {
      setError("Skedari është më i madh se 5 MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Lejohen vetëm JPEG, PNG ose WebP.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const token = tokenStore.getAccess();
      const res = await fetch(`${API_BASE}/profile/me/avatar/`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail =
          (body as { avatar?: string; detail?: string }).avatar ||
          (body as { detail?: string }).detail ||
          "Gabim gjatë ngarkimit.";
        setError(typeof detail === "string" ? detail : "Gabim.");
        return;
      }
      const data = await res.json();
      onUploaded(data.profile?.avatar_url ?? null);
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    if (!confirm("Të hiqet fotoja e profilit?")) return;
    setError("");
    setUploading(true);
    try {
      const token = tokenStore.getAccess();
      const res = await fetch(`${API_BASE}/profile/me/avatar/`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        onUploaded(data.profile?.avatar_url ?? null);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} src={currentUrl} size={72} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            type="button"
          >
            {uploading
              ? "Po ngarkohet…"
              : currentUrl
              ? "Ndrysho foton"
              : "Ngarko foto"}
          </Button>
          {currentUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAvatar}
              disabled={uploading}
              type="button"
              className="text-danger"
            >
              Hiqe
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-stone">
          JPEG, PNG ose WebP · max 5 MB · këshillë: portret me kornizë katrore.
        </p>
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadFile(f);
          // Reset so re-selecting the same file fires onChange
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </div>
  );
}
