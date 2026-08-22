"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MediaClient } from "@/lib/media/media-client";
import type { Producer } from "mediasoup-client/types";
import { useParams } from "next/navigation";

type RemoteParticipant = {
  participantId: string;
  userId: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
};

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");

  return `${m}:${s}`;
}

/** Grid template tuned to feel like a real meeting room, not a spreadsheet. */
function gridLayout(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-3xl";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-5xl";
  if (count <= 4) return "grid-cols-2 max-w-5xl";
  if (count <= 6) return "grid-cols-2 sm:grid-cols-3 max-w-6xl";
  if (count <= 9) return "grid-cols-3 max-w-6xl";
  return "grid-cols-3 sm:grid-cols-4 max-w-7xl";
}

/** Lightweight mic-level meter used to ring the active speaker's tile. */
function useSpeaking(track?: MediaStreamTrack, enabled = true) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!track || !enabled) {
      setSpeaking(false);
      return;
    }

    let raf = 0;
    let cancelled = false;

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(new MediaStream([track]));
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (cancelled) return;

      analyser.getByteFrequencyData(data);

      const avg = data.reduce((sum, value) => sum + value, 0) / data.length;

      setSpeaking(avg > 14);

      raf = requestAnimationFrame(tick);
    };

    void ctx.resume().catch(() => {});
    tick();

    return () => {
      cancelled = true;

      cancelAnimationFrame(raf);
      source.disconnect();
      void ctx.close().catch(() => {});
    };
  }, [track, enabled]);

  return speaking;
}

function VideoTile({
  name,
  videoTrack,
  audioTrack,
  muted,
  cameraOff,
  micOff,
  mirrored,
}: {
  name: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  muted?: boolean;
  cameraOff?: boolean;
  micOff?: boolean;
  mirrored?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const speaking = useSpeaking(audioTrack, !micOff);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = videoTrack
      ? new MediaStream([videoTrack])
      : null;
  }, [videoTrack]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.srcObject = audioTrack
      ? new MediaStream([audioTrack])
      : null;
  }, [audioTrack]);

  return (
    <div
      className={`group relative flex aspect-video w-full animate-[tile-in_0.35s_ease-out] items-center justify-center overflow-hidden rounded-2xl bg-[#3c4043] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ring-1 ring-white/5 transition-shadow duration-300 ${
        speaking ? "ring-2 ring-[#8ab4f8] ring-offset-2 ring-offset-[#0e0e10]" : ""
      }`}
    >
      {!muted && <audio ref={audioRef} autoPlay />}

      {videoTrack && !cameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          className={`h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5f6368] text-lg font-medium tracking-wide text-white">
          {initials(name)}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {micOff && <MicOffIcon className="h-3.5 w-3.5 text-[#f28b82]" />}
        <span>{name}</span>
      </div>
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.08A7 7 0 0 0 19 11Z" />
    </svg>
  );
}

function MicOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18.5 18.5a.75.75 0 1 0 1.06-1.06l-3.32-3.32A7 7 0 0 0 20 11a1 1 0 1 0-2 0 4.98 4.98 0 0 1-1.63 3.7l-1.1-1.1A3 3 0 0 0 15 11V6a3 3 0 0 0-5.7-1.32L3.28 2.22Z" />
      <path d="M12 17.92c-.28.05-.57.08-.86.08A7 7 0 0 1 5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8.94V22H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.06a6.96 6.96 0 0 0 1.85-.49l-1.5-1.5c-.44.12-.9.19-1.35.19Z" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4Z" />
    </svg>
  );
}

function CameraOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l18.5 18.5a.75.75 0 1 0 1.06-1.06l-2.78-2.78V17.5l4 4v-11l-4 4v-3l-1-1V7a2 2 0 0 0-2-2H8.06L3.28 2.22Z" />
      <path d="M3 7.4V17a2 2 0 0 0 2 2h9.6L3 7.4Z" />
    </svg>
  );
}

function LeaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 9c-2.5 0-4.87.5-7.03 1.4a1.5 1.5 0 0 0-.93 1.62l.34 2.3a1.5 1.5 0 0 0 1.32 1.28l3.06.33a1.5 1.5 0 0 0 1.44-.7l.65-1.03a10.6 10.6 0 0 0 2.3 0l.65 1.03a1.5 1.5 0 0 0 1.44.7l3.06-.33a1.5 1.5 0 0 0 1.32-1.28l.34-2.3a1.5 1.5 0 0 0-.93-1.62A18.2 18.2 0 0 0 12 9Z" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M2 19c0-3 3.13-5 7-5s7 2 7 5v1H2v-1Z" />
      <path d="M16.5 14c2.9.3 5.5 2.1 5.5 5v1h-4v-1c0-2-.6-3.6-1.5-5Z" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export default function MeetingPage() {
  const params = useParams<{ roomId: string }>();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const mediaClientRef = useRef<MediaClient | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioProducerRef = useRef<Producer | null>(null);
  const videoProducerRef = useRef<Producer | null>(null);

  const first = useRef(true);

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);

  const [participants, setParticipants] = useState<
    Record<string, RemoteParticipant>
  >({});

  const upsertParticipant = useCallback(
    (
      participantId: string,
      userId: string,
      patch: Partial<RemoteParticipant>,
    ) => {
      setParticipants((prev) => ({
        ...prev,
        [participantId]: {
          participantId,
          userId,
          ...prev[participantId],
          ...patch,
        },
      }));
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    async function start() {
      first.current = false;

      try {
        const client = new MediaClient();

        mediaClientRef.current = client;

        await client.connect(
          process.env.NEXT_PUBLIC_MEDIA_WS_URL ?? "ws://localhost:5001/media",
        );

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

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Mic on by default.
        if (audioTrack) {
          audioProducerRef.current = await client.produceTrack(audioTrack);
        }

        // Camera off by default: keep the track alive locally (for
        // preview when toggled on) but don't send it to the room yet.
        if (videoTrack) {
          videoTrack.enabled = false;
        }

        for (const producer of existingProducers) {
          const consumer = await client.consumeProducer(producer.producerId);

          upsertParticipant(producer.participantId, producer.userId, {
            [producer.kind === "video" ? "videoTrack" : "audioTrack"]:
              consumer.track,
          });
        }

        const onRemoteTrack = (event: Event) => {
          const { participantId, userId, kind, track } = (
            event as CustomEvent
          ).detail;

          upsertParticipant(participantId, userId, {
            [kind === "video" ? "videoTrack" : "audioTrack"]: track,
          });
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

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      mediaClientRef.current?.close();
      mediaClientRef.current = null;
    };
  }, [params.roomId, upsertParticipant]);

  useEffect(() => {
    if (!connected) return;

    const startedAt = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(id);
  }, [connected]);

  const toggleMic = useCallback(async () => {
    const track = localStreamRef.current?.getAudioTracks()[0];

    if (!track) return;

    const next = !micOn;

    track.enabled = next;

    const producer = audioProducerRef.current;

    if (producer) {
      if (next) producer.resume();
      else producer.pause();
    }

    setMicOn(next);
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    const client = mediaClientRef.current;
    const track = localStreamRef.current?.getVideoTracks()[0];

    if (!client || !track) return;

    const next = !cameraOn;

    track.enabled = next;

    if (next) {
      if (videoProducerRef.current) {
        videoProducerRef.current.resume();
      } else {
        videoProducerRef.current = await client.produceTrack(track);
      }
    } else if (videoProducerRef.current) {
      videoProducerRef.current.pause();
    }

    setCameraOn(next);
  }, [cameraOn]);

  const leave = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    mediaClientRef.current?.close();
    mediaClientRef.current = null;

    setConnected(false);
    setParticipants({});
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — nothing to recover from here.
    }
  }, []);

  const remoteList = Object.values(participants);
  const tileCount = remoteList.length + 1;

  return (
    <main className="flex min-h-screen flex-col bg-[#0e0e10] font-sans text-[#e8eaed]">
      <header className="flex items-center justify-between px-6 py-4 sm:px-8">
        <div>
          <h1 className="text-sm font-medium text-[#e8eaed]">
            {params.roomId}
          </h1>

          <p className="mt-0.5 flex items-center gap-2 text-xs text-[#9aa0a6]">
            {connected ? (
              <>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#81c995]" />
                <span className="tabular-nums">
                  {formatDuration(elapsed)}
                </span>
              </>
            ) : (
              "Connecting…"
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-[#9aa0a6] transition-colors hover:bg-white/5 hover:text-[#e8eaed]"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy link"}
          </button>

          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-[#9aa0a6]">
            <PeopleIcon className="h-3.5 w-3.5" />
            {tileCount}
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-6 rounded-lg border border-[#f28b82]/30 bg-[#f28b82]/10 px-4 py-2 text-sm text-[#f28b82] sm:mx-8">
          {error}
        </div>
      )}

      <div className="flex flex-1 items-center justify-center px-6 pb-32 pt-4 sm:px-8">
        <div className="w-full">
          <div
            className={`mx-auto grid auto-rows-fr gap-4 ${gridLayout(tileCount)}`}
          >
            <VideoTile
              name="You"
              videoTrack={
                cameraOn
                  ? localStreamRef.current?.getVideoTracks()[0]
                  : undefined
              }
              audioTrack={micOn ? localStreamRef.current?.getAudioTracks()[0] : undefined}
              muted
              cameraOff={!cameraOn}
              micOff={!micOn}
              mirrored
            />

            {remoteList.map((participant) => (
              <VideoTile
                key={participant.participantId}
                name={participant.userId.slice(0, 8)}
                videoTrack={participant.videoTrack}
                audioTrack={participant.audioTrack}
                cameraOff={!participant.videoTrack}
              />
            ))}
          </div>

          {connected && remoteList.length === 0 && (
            <p className="mt-6 text-center text-sm text-[#9aa0a6]">
              You&rsquo;re the only one here — copy the link above to bring others in.
            </p>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 flex justify-center pb-8">
        <div className="flex items-center gap-3 rounded-full bg-[#28292c]/90 px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => void toggleMic()}
            aria-label={micOn ? "Turn off microphone" : "Turn on microphone"}
            title={micOn ? "Turn off microphone" : "Turn on microphone"}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              micOn
                ? "bg-[#3c4043] hover:bg-[#4a4d51]"
                : "bg-[#ea4335] hover:bg-[#d33b2c]"
            }`}
          >
            {micOn ? (
              <MicIcon className="h-5 w-5" />
            ) : (
              <MicOffIcon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => void toggleCamera()}
            aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
            title={cameraOn ? "Turn off camera" : "Turn on camera"}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              cameraOn
                ? "bg-[#3c4043] hover:bg-[#4a4d51]"
                : "bg-[#ea4335] hover:bg-[#d33b2c]"
            }`}
          >
            {cameraOn ? (
              <CameraIcon className="h-5 w-5" />
            ) : (
              <CameraOffIcon className="h-5 w-5" />
            )}
          </button>

          <div className="mx-1 h-8 w-px bg-white/10" />

          <button
            type="button"
            onClick={leave}
            aria-label="Leave call"
            title="Leave call"
            className="flex h-12 w-16 items-center justify-center rounded-full bg-[#ea4335] transition-colors hover:bg-[#d33b2c]"
          >
            <LeaveIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tile-in {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
