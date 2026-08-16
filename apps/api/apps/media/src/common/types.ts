import type {
  Consumer,
  Producer,
  Router,
  WebRtcTransport,
} from "mediasoup/types";
import type { WebSocket } from "ws";

export type TMediaRoom = {
  id: string;
  router: Router;
};

export type TParticipant = {
  id: string;
  userId: string;
  roomId: string;

  socket: WebSocket;

  sendTransport?: WebRtcTransport;
  receiveTransport?: WebRtcTransport;

  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
};
