import { TParticipant } from "@/common/types";
import { Injectable } from "@nestjs/common";
import { v7 as uuidv7 } from "uuid";
import { WebSocket } from "ws";

@Injectable()
export class ParticipantsService {
  private readonly participants = new Map<string, TParticipant>();

  createParticipant(
    userId: string,
    roomId: string,
    socket: WebSocket,
  ): TParticipant {
    const participant: TParticipant = {
      id: uuidv7(),
      userId,
      roomId,
      socket,

      producers: new Map(),
      consumers: new Map(),
    };

    this.participants.set(participant.id, participant);

    return participant;
  }

  getParticipant(participantId: string): TParticipant | undefined {
    return this.participants.get(participantId);
  }

  getParticipantsByRoom(roomId: string): TParticipant[] {
    const participants: TParticipant[] = [];

    this.participants.forEach((participant) => {
      if (participant.roomId === roomId) {
        participants.push(participant);
      }
    });

    return participants;
  }

  getParticipantBySocket(socket: WebSocket): TParticipant | undefined {
    let participant: TParticipant | undefined = undefined;

    this.participants.forEach((participantItem) => {
      if (participantItem.socket === socket) {
        participant = participantItem;

        return participant;
      }
    });

    return participant;
  }

  removeParticipant(participantId: string) {
    const participant = this.getParticipant(participantId);

    if (!participant) return;

    for (const producer of participant.producers.values()) {
      producer.close();
    }

    for (const consumer of participant.consumers.values()) {
      consumer.close();
    }

    participant.sendTransport?.close();
    participant.receiveTransport?.close();

    this.participants.delete(participantId);
  }
}
