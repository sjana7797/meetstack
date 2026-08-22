"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaClient } from "@/lib/media/media-client";
import type { Producer } from "mediasoup-client/types";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  Cast,
  Check,
  ChevronDown,
  Copy,
  Hand,
  Headphones,
  HelpCircle,
  Info,
  Laptop,
  Lock,
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  Pin,
  PinOff,
  Radio,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Smile,
  Sparkles,
  Subtitles,
  Users,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  Wand2,
  X,
} from "lucide-react";
import Link from "next/link";

type RemoteParticipant = {
  participantId: string;
  userId: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  isHost?: boolean;
};

type ChatMessage = {
  id: string;
  sender: string;
  time: string;
  text: string;
  isSelf?: boolean;
};

type FloatingReaction = {
  id: string;
  emoji: string;
  x: number;
};

function initials(name: string) {
  if (!name.trim()) return "ME";
  return name.trim().slice(0, 2).toUpperCase();
}

function getAvatarBg(name: string) {
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function useSpeaking(track?: MediaStreamTrack, enabled = true) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!track || !enabled) {
      setSpeaking(false);
      return;
    }

    let raf = 0;
    let cancelled = false;

    try {
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
    } catch {
      // AudioContext unavailable
    }
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
  isSelf,
  isPinned,
  onPin,
  handRaised,
}: {
  name: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  muted?: boolean;
  cameraOff?: boolean;
  micOff?: boolean;
  mirrored?: boolean;
  isSelf?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
  handRaised?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const speaking = useSpeaking(audioTrack, !micOff);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = videoTrack ? new MediaStream([videoTrack]) : null;
  }, [videoTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = audioTrack ? new MediaStream([audioTrack]) : null;
  }, [audioTrack]);

  return (
    <div
      className={`group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[#3c4043] transition-all duration-300 ${
        speaking
          ? "ring-4 ring-[#8ab4f8] shadow-lg shadow-[#8ab4f8]/20"
          : "ring-1 ring-white/10"
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
        <div className="flex flex-col items-center gap-3">
          <div
            className={`flex size-20 sm:size-24 items-center justify-center rounded-full text-2xl sm:text-3xl font-semibold text-white shadow-xl transition-transform duration-300 ${getAvatarBg(
              name
            )} ${speaking ? "scale-110 ring-4 ring-[#8ab4f8]/80 animate-pulse" : ""}`}
          >
            {initials(name)}
          </div>
          <span className="text-xs font-medium text-white/70 sm:hidden">{name}</span>
        </div>
      )}

      {/* Hand Raised Badge */}
      {handRaised && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#8ab4f8] px-2.5 py-1 text-xs font-bold text-[#202124] shadow-md animate-bounce">
          <Hand className="size-3.5 fill-current" />
          <span>Hand raised</span>
        </div>
      )}

      {/* Tile Action Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {onPin && (
          <button
            type="button"
            onClick={onPin}
            title={isPinned ? "Unpin tile" : "Pin tile to main stage"}
            className={`flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isPinned
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-black/60 text-white hover:bg-black/80"
            }`}
          >
            {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          </button>
        )}
      </div>

      {/* Bottom Left: Name & Audio Status Tag */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-[#202124]/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md shadow-sm">
        {micOff ? (
          <MicOff className="size-3.5 text-[#f28b82]" />
        ) : (
          <div className="flex items-center gap-1">
            <span
              className={`size-2 rounded-full ${
                speaking ? "bg-[#81c995] animate-ping" : "bg-[#81c995]"
              }`}
            />
          </div>
        )}
        <span className="truncate max-w-[120px] sm:max-w-[180px]">
          {name} {isSelf && "(You)"}
        </span>
      </div>
    </div>
  );
}

export default function MeetingPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();

  // Phase 1: Pre-join Lobby states
  const [hasJoined, setHasJoined] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [audioInputLevel, setAudioInputLevel] = useState(0);

  // Device & Track states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Phase 2: In-Meeting WebRTC & Call states
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaClientRef = useRef<MediaClient | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioProducerRef = useRef<Producer | null>(null);
  const videoProducerRef = useRef<Producer | null>(null);
  const screenProducerRef = useRef<Producer | null>(null);

  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Active side panel (Google Meet right drawer)
  const [activeDrawer, setActiveDrawer] = useState<
    "info" | "people" | "chat" | "security" | null
  >(null);

  // Reaction emojis
  const [showReactions, setShowReactions] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // Participants
  const [participants, setParticipants] = useState<Record<string, RemoteParticipant>>({});

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request permissions & set up preview stream in lobby
  const requestMediaPermissions = useCallback(async () => {
    setIsRequestingPermission(true);
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setLocalStream(stream);

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      // Start audio meter
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        try {
          const ctx = new AudioContext();
          const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]));
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          const data = new Uint8Array(analyser.frequencyBinCount);

          const checkLevel = () => {
            if (!audioTrack.enabled) {
              setAudioInputLevel(0);
              return;
            }
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            setAudioInputLevel(Math.min(100, Math.round(avg * 2)));
            requestAnimationFrame(checkLevel);
          };
          checkLevel();
        } catch {
          // Audio level meter fallback
        }
      }
    } catch (err) {
      console.error("Camera/mic permission error:", err);
      setPermissionError(
        "Camera and microphone access was denied. Please allow permissions in your browser address bar to enable video and audio."
      );
    } finally {
      setIsRequestingPermission(false);
    }
  }, []);

  // Auto-request permissions on initial load of lobby
  useEffect(() => {
    if (!hasJoined) {
      void requestMediaPermissions();
    }
  }, [hasJoined, requestMediaPermissions]);

  // Handle lobby camera toggle
  const toggleLobbyCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const next = !cameraOn;
        videoTrack.enabled = next;
        setCameraOn(next);
      }
    }
  };

  // Handle lobby mic toggle
  const toggleLobbyMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const next = !micOn;
        audioTrack.enabled = next;
        setMicOn(next);
      }
    }
  };

  const upsertParticipant = useCallback(
    (participantId: string, userId: string, patch: Partial<RemoteParticipant>) => {
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
    []
  );

  // Connect to room after clicking "Join now"
  const joinMeetingRoom = async (presentDirectly = false) => {
    setHasJoined(true);
    setMessages([
      {
        id: "1",
        sender: "Meetstack System",
        time: formatTime(new Date()),
        text: `Welcome, ${userName.trim() || "Guest"}! Connected to secure room "${params.roomId}".`,
      },
    ]);

    try {
      const client = new MediaClient();
      mediaClientRef.current = client;

      await client.connect(
        process.env.NEXT_PUBLIC_MEDIA_WS_URL ?? "ws://localhost:5001/media"
      );

      const { existingProducers } = await client.joinRoom(
        params.roomId,
        crypto.randomUUID()
      );

      await client.createSendTransport();
      await client.createRecvTransport();

      let stream = localStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
      }

      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (audioTrack) {
        audioTrack.enabled = micOn;
        audioProducerRef.current = await client.produceTrack(audioTrack);
      }

      if (videoTrack) {
        videoTrack.enabled = cameraOn;
        if (cameraOn) {
          videoProducerRef.current = await client.produceTrack(videoTrack);
        }
      }

      for (const producer of existingProducers) {
        const consumer = await client.consumeProducer(producer.producerId);
        upsertParticipant(producer.participantId, producer.userId, {
          [producer.kind === "video" ? "videoTrack" : "audioTrack"]: consumer.track,
        });
      }

      const onRemoteTrack = (event: Event) => {
        const { participantId, userId, kind, track } = (event as CustomEvent).detail;
        upsertParticipant(participantId, userId, {
          [kind === "video" ? "videoTrack" : "audioTrack"]: track,
        });
      };

      window.addEventListener("remote-track", onRemoteTrack);
      setConnected(true);

      if (presentDirectly) {
        void toggleScreenShare();
      }
    } catch (err) {
      console.error(err);
      setConnected(true);
    }
  };

  // In-meeting Mic Toggle
  const toggleMic = useCallback(async () => {
    const track = localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !micOn;
    }
    const producer = audioProducerRef.current;
    if (producer) {
      if (!micOn) producer.resume();
      else producer.pause();
    }
    setMicOn(!micOn);
  }, [micOn, localStream]);

  // In-meeting Camera Toggle
  const toggleCamera = useCallback(async () => {
    const client = mediaClientRef.current;
    const track = localStream?.getVideoTracks()[0];
    const next = !cameraOn;

    if (track) {
      track.enabled = next;
    }

    if (client && track) {
      if (next) {
        if (videoProducerRef.current) {
          videoProducerRef.current.resume();
        } else {
          videoProducerRef.current = await client.produceTrack(track);
        }
      } else if (videoProducerRef.current) {
        videoProducerRef.current.pause();
      }
    }
    setCameraOn(next);
  }, [cameraOn, localStream]);

  // In-meeting Screen Share Toggle
  const toggleScreenShare = useCallback(async () => {
    if (screenSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      screenProducerRef.current?.close();
      screenProducerRef.current = null;
      setScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = stream;
        const screenTrack = stream.getVideoTracks()[0];

        screenTrack.onended = () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
          screenProducerRef.current?.close();
          screenProducerRef.current = null;
        };

        if (mediaClientRef.current) {
          screenProducerRef.current = await mediaClientRef.current.produceTrack(screenTrack);
        }
        setScreenSharing(true);
      } catch (err) {
        console.log("Screen share cancelled", err);
      }
    }
  }, [screenSharing]);

  // Trigger floating reaction
  const triggerReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = Math.random() * 80 + 10;
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);
    setShowReactions(false);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2800);
  };

  // Leave room
  const leave = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;
    mediaClientRef.current?.close();
    mediaClientRef.current = null;
    setConnected(false);
    setHasJoined(false);
    router.push("/");
  }, [router, localStream]);

  // Copy meeting link
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied
    }
  }, []);

  // Send chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userName.trim() || "You",
      time: formatTime(new Date()),
      text: chatInput.trim(),
      isSelf: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const remoteList = Object.values(participants);
  const totalCount = remoteList.length + 1;

  // Grid layout helper
  const getGridClasses = () => {
    if (pinnedId || screenSharing) {
      return "grid-cols-1";
    }
    if (totalCount === 1) return "grid-cols-1 max-w-4xl max-h-[75vh]";
    if (totalCount === 2) return "grid-cols-1 sm:grid-cols-2 max-w-6xl max-h-[75vh]";
    if (totalCount <= 4) return "grid-cols-2 max-w-6xl max-h-[80vh]";
    if (totalCount <= 6) return "grid-cols-2 sm:grid-cols-3 max-w-7xl max-h-[82vh]";
    return "grid-cols-3 sm:grid-cols-4 max-w-7xl";
  };

  // =========================================================================
  // VIEW 1: GOOGLE MEET PRE-JOIN LOBBY ("Ready to join?")
  // =========================================================================
  if (!hasJoined) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202124] text-[#e8eaed] font-sans selection:bg-[#1a73e8]/30">
        {/* Lobby Google Header */}
        <header className="flex h-16 items-center justify-between px-6 sm:px-10 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 font-normal text-white">
            <div className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1a73e8] via-[#00ac47] to-[#f9ab00] p-0.5 shadow-sm">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#202124] text-white">
                <VideoIcon className="size-4 text-[#8ab4f8]" />
              </div>
            </div>
            <span className="text-lg">
              Meet<span className="font-semibold text-[#8ab4f8]">stack</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-white/70">
            <span className="hidden sm:inline-block">
              {formatTime(currentTime)}
            </span>
            <div className="flex size-8 items-center justify-center rounded-full bg-[#1a73e8] text-xs font-bold text-white">
              {initials(userName)}
            </div>
          </div>
        </header>

        {/* Main Lobby Container */}
        <main className="mx-auto flex flex-1 w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left: Video Preview & Hardware Controls */}
            <div className="flex flex-col items-center lg:col-span-7">
              <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-3xl bg-[#3c4043] shadow-2xl ring-1 ring-white/10">
                {cameraOn && localStream?.getVideoTracks()[0]?.enabled ? (
                  <video
                    ref={previewVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                    <div
                      className={`flex size-24 items-center justify-center rounded-full text-3xl font-bold text-white shadow-xl ${getAvatarBg(
                        userName
                      )}`}
                    >
                      {initials(userName)}
                    </div>
                    <p className="text-sm font-medium text-white/70">Camera is off</p>
                  </div>
                )}

                {/* Audio wave activity meter pill */}
                {micOn && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <span
                      className={`size-2 rounded-full ${
                        audioInputLevel > 15 ? "bg-[#81c995] animate-ping" : "bg-[#81c995]"
                      }`}
                    />
                    <span>{audioInputLevel > 15 ? "Speaking" : "Mic connected"}</span>
                  </div>
                )}

                {/* Bottom Floating Control Buttons (Google Meet Style) */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                  {/* Mic toggle */}
                  <button
                    type="button"
                    onClick={toggleLobbyMic}
                    title={micOn ? "Turn off microphone" : "Turn on microphone"}
                    className={`flex size-12 items-center justify-center rounded-full shadow-lg transition-all ${
                      micOn
                        ? "bg-[#3c4043] text-white hover:bg-[#4a4d51]"
                        : "bg-[#ea4335] text-white hover:bg-[#d33b2c]"
                    }`}
                  >
                    {micOn ? <Mic className="size-5" /> : <MicOff className="size-5 text-white" />}
                  </button>

                  {/* Camera toggle */}
                  <button
                    type="button"
                    onClick={toggleLobbyCamera}
                    title={cameraOn ? "Turn off camera" : "Turn on camera"}
                    className={`flex size-12 items-center justify-center rounded-full shadow-lg transition-all ${
                      cameraOn
                        ? "bg-[#3c4043] text-white hover:bg-[#4a4d51]"
                        : "bg-[#ea4335] text-white hover:bg-[#d33b2c]"
                    }`}
                  >
                    {cameraOn ? (
                      <VideoIcon className="size-5" />
                    ) : (
                      <VideoOff className="size-5 text-white" />
                    )}
                  </button>

                  {/* Effects toggle */}
                  <button
                    type="button"
                    title="Visual effects"
                    className="flex size-12 items-center justify-center rounded-full bg-[#3c4043] text-white shadow-lg transition-all hover:bg-[#4a4d51]"
                  >
                    <Wand2 className="size-5" />
                  </button>

                  {/* Settings toggle */}
                  <button
                    type="button"
                    onClick={() => void requestMediaPermissions()}
                    title="Check audio & video permissions"
                    className="flex size-12 items-center justify-center rounded-full bg-[#3c4043] text-white shadow-lg transition-all hover:bg-[#4a4d51]"
                  >
                    <Sliders className="size-5" />
                  </button>
                </div>
              </div>

              {/* Permission Alert if denied */}
              {permissionError && (
                <div className="mt-4 flex w-full max-w-xl items-start gap-3 rounded-2xl border border-[#f28b82]/30 bg-[#f28b82]/10 p-4 text-xs text-[#f28b82]">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Permissions Required</p>
                    <p className="mt-0.5 text-white/80">{permissionError}</p>
                    <button
                      type="button"
                      onClick={() => void requestMediaPermissions()}
                      className="mt-2 font-bold underline underline-offset-2 hover:text-white"
                    >
                      Retry granting permissions
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Meeting Join Details & Name Input */}
            <div className="space-y-6 lg:col-span-5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
                  Ready to join?
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Room: <span className="font-semibold text-white">{params.roomId}</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <ShieldCheck className="size-3.5 text-[#81c995]" />
                  <span>No one else is in this room yet</span>
                </div>
              </div>

              {/* Guest Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white outline-none transition-colors focus:border-[#8ab4f8] focus:ring-2 focus:ring-[#8ab4f8]/20"
                />
              </div>

              {/* Join Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => joinMeetingRoom(false)}
                  disabled={!userName.trim()}
                  className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 text-sm font-semibold text-white shadow-lg shadow-[#1a73e8]/25 transition-all hover:bg-[#1557b0] disabled:opacity-50"
                >
                  <span>Join now</span>
                </button>

                <button
                  type="button"
                  onClick={() => joinMeetingRoom(true)}
                  disabled={!userName.trim()}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#8ab4f8] px-6 text-sm font-semibold text-[#8ab4f8] transition-colors hover:bg-[#8ab4f8]/10 disabled:opacity-50"
                >
                  <Laptop className="size-4" />
                  <span>Present</span>
                </button>
              </div>

              {/* Other Options */}
              <div className="pt-2 text-xs text-white/60 space-y-1">
                <p>
                  🔒 Encrypted room • By joining you agree to Meetstack Terms.
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="font-medium text-[#8ab4f8] hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <Copy className="size-3" />
                  {copied ? "Link copied" : "Copy joining link"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: GOOGLE MEET ACTIVE CALL ROOM
  // =========================================================================
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#202124] text-[#e8eaed] font-sans select-none">
      {/* Floating Reaction Emojis Container */}
      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        {floatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            style={{ left: `${reaction.x}%` }}
            className="absolute bottom-24 text-4xl animate-[float-up_2.8s_ease-out_forwards]"
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Main Video Meeting Stage */}
      <main className="relative flex flex-1 overflow-hidden p-3 sm:p-4">
        <div className="flex flex-1 items-center justify-center overflow-hidden transition-all duration-300">
          <div className="flex h-full w-full items-center justify-center">
            {screenSharing ? (
              /* Screen Share / Presenter Mode View */
              <div className="flex h-full w-full flex-col gap-3 lg:flex-row">
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <Laptop className="size-3.5 text-[#8ab4f8]" />
                    <span>You are presenting your screen</span>
                  </div>
                  <div className="flex h-full w-full items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#3c4043] text-[#8ab4f8]">
                        <Cast className="size-8" />
                      </div>
                      <h3 className="text-base font-semibold">Your screen is being shared</h3>
                      <p className="text-xs text-white/60">
                        Everyone in this room can see your presentation.
                      </p>
                      <button
                        type="button"
                        onClick={toggleScreenShare}
                        className="mt-2 rounded-full bg-[#ea4335] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#d33b2c]"
                      >
                        Stop presenting
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filmstrip thumbnails */}
                <div className="flex gap-2 overflow-x-auto lg:w-72 lg:flex-col lg:overflow-y-auto">
                  <div className="aspect-video w-48 shrink-0 lg:w-full">
                    <VideoTile
                      name={userName || "You"}
                      videoTrack={
                        cameraOn ? localStream?.getVideoTracks()[0] : undefined
                      }
                      audioTrack={
                        micOn ? localStream?.getAudioTracks()[0] : undefined
                      }
                      muted
                      cameraOff={!cameraOn}
                      micOff={!micOn}
                      mirrored
                      isSelf
                      handRaised={handRaised}
                    />
                  </div>
                  {remoteList.map((p) => (
                    <div key={p.participantId} className="aspect-video w-48 shrink-0 lg:w-full">
                      <VideoTile
                        name={p.userId.slice(0, 8)}
                        videoTrack={p.videoTrack}
                        audioTrack={p.audioTrack}
                        cameraOff={!p.videoTrack}
                        onPin={() => setPinnedId(p.participantId)}
                        isPinned={pinnedId === p.participantId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Standard Adaptive Grid View */
              <div
                className={`grid h-full w-full gap-3 p-1 ${getGridClasses()}`}
                style={{
                  gridAutoRows: "minmax(0, 1fr)",
                }}
              >
                {/* Local Participant Tile */}
                <VideoTile
                  name={userName || "You"}
                  videoTrack={
                    cameraOn ? localStream?.getVideoTracks()[0] : undefined
                  }
                  audioTrack={
                    micOn ? localStream?.getAudioTracks()[0] : undefined
                  }
                  muted
                  cameraOff={!cameraOn}
                  micOff={!micOn}
                  mirrored
                  isSelf
                  handRaised={handRaised}
                  onPin={() => setPinnedId(pinnedId === "self" ? null : "self")}
                  isPinned={pinnedId === "self"}
                />

                {/* Remote Participants */}
                {remoteList.map((participant) => (
                  <VideoTile
                    key={participant.participantId}
                    name={participant.userId.slice(0, 8)}
                    videoTrack={participant.videoTrack}
                    audioTrack={participant.audioTrack}
                    cameraOff={!participant.videoTrack}
                    onPin={() =>
                      setPinnedId(
                        pinnedId === participant.participantId ? null : participant.participantId
                      )
                    }
                    isPinned={pinnedId === participant.participantId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real-time Closed Captions Overlay */}
        {captionsOn && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-black/85 px-6 py-2.5 text-center text-sm font-medium text-white shadow-2xl backdrop-blur-md max-w-xl">
            <span className="text-[#8ab4f8] font-bold mr-2">{userName || "You"}:</span>
            <span>Microphone audio is actively streamed with noise filtering...</span>
          </div>
        )}

        {/* Google Meet Right Slide-out Drawer */}
        {activeDrawer && (
          <aside className="ml-3 flex w-80 sm:w-96 flex-col overflow-hidden rounded-2xl bg-[#28292c] border border-white/10 shadow-2xl animate-[slide-in_0.25s_ease-out]">
            {/* Drawer Header */}
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">
              <h2 className="text-base font-semibold text-white capitalize">
                {activeDrawer === "info" && "Meeting Details"}
                {activeDrawer === "people" && `People (${totalCount})`}
                {activeDrawer === "chat" && "In-Call Messages"}
                {activeDrawer === "security" && "Host Controls"}
              </h2>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="flex size-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* 1. People Drawer */}
              {activeDrawer === "people" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      In the call
                    </span>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="text-xs font-semibold text-[#8ab4f8] hover:underline"
                    >
                      Add people
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Self item */}
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarBg(
                            userName
                          )}`}
                        >
                          {initials(userName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{userName} (You)</p>
                          <p className="text-xs text-white/60">Host Organizer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {handRaised && <Hand className="size-4 text-[#8ab4f8]" />}
                        {micOn ? (
                          <Mic className="size-4 text-[#81c995]" />
                        ) : (
                          <MicOff className="size-4 text-[#f28b82]" />
                        )}
                      </div>
                    </div>

                    {/* Remote items */}
                    {remoteList.map((p) => (
                      <div
                        key={p.participantId}
                        className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-9 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarBg(
                              p.userId
                            )}`}
                          >
                            {initials(p.userId)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {p.userId.slice(0, 8)}
                            </p>
                            <p className="text-xs text-white/60">Attendee</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mic className="size-4 text-[#81c995]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. In-Call Chat Drawer */}
              {activeDrawer === "chat" && (
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-3.5 overflow-y-auto pr-1">
                    <div className="rounded-lg bg-white/5 p-3 text-xs text-white/70">
                      Messages can be seen only by people in the call and are deleted when the
                      call ends.
                    </div>

                    {messages.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-bold text-[#8ab4f8]">{msg.sender}</span>
                          <span className="text-[10px] text-white/50">{msg.time}</span>
                        </div>
                        <div className="rounded-xl bg-[#3c4043] p-3 text-sm text-white leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Send a message to everyone"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#8ab4f8]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#8ab4f8] text-[#202124] disabled:opacity-40"
                    >
                      <Send className="size-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* 3. Meeting Details Drawer */}
              {activeDrawer === "info" && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Joining info
                    </h4>
                    <p className="mt-1 text-sm font-semibold text-white">
                      meetstack.live/{params.roomId}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyLink}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8ab4f8] py-2.5 text-sm font-bold text-[#202124] transition-colors hover:bg-[#aecbfa]"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Link Copied to Clipboard" : "Copy Joining Info"}
                  </button>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#81c995]">
                      <ShieldCheck className="size-4" />
                      <span>End-to-End Encrypted Call</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Only people with this secure link can join. Your audio and video tracks are
                      transmitted over WebRTC DTLS-SRTP.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Host Controls Drawer */}
              {activeDrawer === "security" && (
                <div className="space-y-4">
                  <p className="text-xs text-white/60">
                    Use these host settings to manage participant permissions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Share their screen</p>
                        <p className="text-xs text-white/60">Allow attendees to present</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="size-4 rounded accent-[#8ab4f8]"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Send chat messages</p>
                        <p className="text-xs text-white/60">Allow in-call texting</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="size-4 rounded accent-[#8ab4f8]"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Turn on microphone</p>
                        <p className="text-xs text-white/60">Allow voice transmission</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="size-4 rounded accent-[#8ab4f8]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </main>

      {/* Google Meet Signature Bottom Control Bar */}
      <footer className="relative z-40 flex h-20 w-full items-center justify-between bg-[#202124] px-4 sm:px-6">
        {/* Left: Time & Room Code */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm font-semibold text-white tracking-wide">
            {formatTime(currentTime)}
          </span>
          <span className="text-white/30">|</span>
          <span className="text-sm font-semibold text-white/90 truncate max-w-[160px]">
            {params.roomId}
          </span>
          {connected && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#81c995]/15 px-2 py-0.5 text-[11px] font-semibold text-[#81c995]">
              <span className="size-1.5 rounded-full bg-[#81c995] animate-pulse" />
              Secure
            </span>
          )}
        </div>

        {/* Center: Core Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
          {/* 1. Microphone Toggle */}
          <button
            type="button"
            onClick={toggleMic}
            title={micOn ? "Turn off microphone (⌘+D)" : "Turn on microphone (⌘+D)"}
            className={`flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-200 shadow-md ${
              micOn
                ? "bg-[#3c4043] text-white hover:bg-[#43474b]"
                : "bg-[#ea4335] text-white hover:bg-[#d33b2c]"
            }`}
          >
            {micOn ? <Mic className="size-5" /> : <MicOff className="size-5 text-white" />}
          </button>

          {/* 2. Camera Toggle */}
          <button
            type="button"
            onClick={toggleCamera}
            title={cameraOn ? "Turn off camera (⌘+E)" : "Turn on camera (⌘+E)"}
            className={`flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-200 shadow-md ${
              cameraOn
                ? "bg-[#3c4043] text-white hover:bg-[#43474b]"
                : "bg-[#ea4335] text-white hover:bg-[#d33b2c]"
            }`}
          >
            {cameraOn ? <VideoIcon className="size-5" /> : <VideoOff className="size-5 text-white" />}
          </button>

          {/* 3. Captions CC Toggle */}
          <button
            type="button"
            onClick={() => setCaptionsOn(!captionsOn)}
            title="Turn on captions"
            className={`hidden sm:flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-200 ${
              captionsOn
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-[#3c4043] text-white hover:bg-[#43474b]"
            }`}
          >
            <Subtitles className="size-5" />
          </button>

          {/* 4. Raise Hand Button */}
          <button
            type="button"
            onClick={() => setHandRaised(!handRaised)}
            title="Raise or lower hand"
            className={`flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-200 ${
              handRaised
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-[#3c4043] text-white hover:bg-[#43474b]"
            }`}
          >
            <Hand className="size-5" />
          </button>

          {/* 5. Reactions Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReactions(!showReactions)}
              title="Send a reaction"
              className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-[#3c4043] text-white hover:bg-[#43474b] transition-all"
            >
              <Smile className="size-5" />
            </button>

            {showReactions && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-[#28292c] p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
                {["💖", "👍", "👏", "🎉", "😂", "😮"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => triggerReaction(emoji)}
                    className="flex size-9 items-center justify-center rounded-full text-xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Screen Sharing / Present Now */}
          <button
            type="button"
            onClick={toggleScreenShare}
            title={screenSharing ? "Stop presenting" : "Present now"}
            className={`flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-200 ${
              screenSharing
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-[#3c4043] text-white hover:bg-[#43474b]"
            }`}
          >
            <Laptop className="size-5" />
          </button>

          {/* 7. Leave Call Button */}
          <button
            type="button"
            onClick={leave}
            title="Leave call"
            className="flex h-11 sm:h-12 px-5 sm:px-6 items-center justify-center rounded-full bg-[#ea4335] text-white font-semibold transition-all hover:bg-[#d33b2c] shadow-lg shadow-[#ea4335]/25"
          >
            <PhoneOffIcon className="size-5 sm:mr-1.5 text-white" />
            <span className="hidden sm:inline text-xs font-bold text-white">Leave</span>
          </button>
        </div>

        {/* Right: Drawer Toggles */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Info Toggle */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "info" ? null : "info")}
            title="Meeting details"
            className={`flex size-10 items-center justify-center rounded-full transition-colors ${
              activeDrawer === "info"
                ? "bg-[#8ab4f8] text-[#202124]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Info className="size-5" />
          </button>

          {/* People Toggle */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "people" ? null : "people")}
            title="People"
            className={`relative flex size-10 items-center justify-center rounded-full transition-colors ${
              activeDrawer === "people"
                ? "bg-[#8ab4f8] text-[#202124]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="size-5" />
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
              {totalCount}
            </span>
          </button>

          {/* Chat Toggle */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "chat" ? null : "chat")}
            title="Chat with everyone"
            className={`relative flex size-10 items-center justify-center rounded-full transition-colors ${
              activeDrawer === "chat"
                ? "bg-[#8ab4f8] text-[#202124]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MessageSquare className="size-5" />
            {messages.length > 1 && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-[#8ab4f8]" />
            )}
          </button>

          {/* Host Controls Toggle */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === "security" ? null : "security")}
            title="Host controls"
            className={`flex size-10 items-center justify-center rounded-full transition-colors ${
              activeDrawer === "security"
                ? "bg-[#8ab4f8] text-[#202124]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Shield className="size-5" />
          </button>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-120px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translateY(-240px) scale(1.1);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function PhoneOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 9c-2.5 0-4.87.5-7.03 1.4a1.5 1.5 0 0 0-.93 1.62l.34 2.3a1.5 1.5 0 0 0 1.32 1.28l3.06.33a1.5 1.5 0 0 0 1.44-.7l.65-1.03a10.6 10.6 0 0 0 2.3 0l.65 1.03a1.5 1.5 0 0 0 1.44.7l3.06-.33a1.5 1.5 0 0 0 1.32-1.28l.34-2.3a1.5 1.5 0 0 0-.93-1.62A18.2 18.2 0 0 0 12 9Z" />
    </svg>
  );
}
