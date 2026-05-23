"use client";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/http";

type InitUploadResponse = { uploadUrl: string; uploadSessionId: string; fileObjectId: string; headers?: Record<string, string> };
export function useFileUpload() {
  return useMutation({
    mutationFn: async ({ file, purpose = "OTHER" }: { file: File; purpose?: string }) => {
      const init = await apiFetch<InitUploadResponse>({ path: "/uploads/init", method: "POST", body: JSON.stringify({ filename: file.name, mimeType: file.type, sizeBytes: file.size, purpose }), csrf: true });
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", init.uploadUrl);
        Object.entries(init.headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Falha no upload")));
        xhr.onerror = () => reject(new Error("Falha de rede durante o upload"));
        xhr.send(file);
      });
      await apiFetch({ path: "/uploads/complete", method: "POST", body: JSON.stringify({ uploadSessionId: init.uploadSessionId }), csrf: true });
      return init;
    },
  });
}

