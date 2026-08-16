"use client";

import { useEffect, useRef, useState } from "react";

import { MediaClient } from "@/lib/media/media-client";
import { useParams } from "next/navigation";

export default function MeetingPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const params = useParams<{ roomId: string }>();

  const first = useRef(true);

  const remoteContainerRef = useRef<HTMLDivElement>(null);

  const mediaClientRef = useRef<MediaClient | null>(null);

  const [connected, setConnected] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function start() {
      first.current = false;
      try {
        const client = new MediaClient();

        mediaClientRef.current = client;

        await client.connect("ws://localhost:5001/media");

        const { existingProducers } = await client.joinRoom(
          params.roomId,
          crypto.randomUUID(),
        );

        await client.createSendTransport();

        await client.createRecvTransport();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        for (const track of stream.getTracks()) {
          await client.produceTrack(track);
        }

        for (const producer of existingProducers) {
          const consumer = await client.consumeProducer(producer.producerId);

          const video = document.createElement("video");

          video.autoplay = true;
          video.playsInline = true;

          video.srcObject = new MediaStream([consumer.track]);

          remoteContainerRef.current?.appendChild(video);
        }

        const onRemoteTrack = (event: Event) => {
          const customEvent = event as CustomEvent;

          console.log(customEvent);

          const { track } = customEvent.detail;

          const video = document.createElement("video");

          video.autoplay = true;
          video.playsInline = true;

          video.srcObject = new MediaStream([track]);

          remoteContainerRef.current?.appendChild(video);
        };

        window.addEventListener("remote-track", onRemoteTrack);

        if (mounted) {
          setConnected(true);
        }

        return () => {
          window.removeEventListener("remote-track", onRemoteTrack);
        };
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to join meeting",
          );
        }
      }
    }

    if (first.current) void start();

    return () => {
      mounted = false;
      first.current = true;

      mediaClientRef.current?.close();
    };
  }, [params.roomId]);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meeting</h1>

        <p className="text-sm text-gray-400">Room: {params.roomId}</p>

        <p className="text-sm">
          Status: {connected ? "Connected" : "Connecting..."}
        </p>

        {error && <p className="text-red-400">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-2">You</h2>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg bg-gray-900"
          />
        </div>

        <div>
          <h2 className="mb-2">Participants</h2>

          <div ref={remoteContainerRef} className="grid grid-cols-2 gap-4" />
        </div>
      </div>
    </main>
  );
}
