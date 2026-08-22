import { Injectable, Logger } from "@nestjs/common";

import { TMediaRoom } from "@/common/types";
import { RouterService } from "@/modules/mediasoup/router/router.service";

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  private readonly rooms = new Map<string, TMediaRoom>();

  constructor(private readonly routerService: RouterService) {}

  async createRoom(roomId: string): Promise<TMediaRoom> {
    const existing = this.rooms.get(roomId);

    if (existing) {
      return existing;
    }

    const router = await this.routerService.createRouter();
    const room: TMediaRoom = {
      id: roomId,
      router,
    };

    router.on("workerclose", () => {
      this.rooms.delete(roomId);
    });

    this.rooms.set(roomId, room);

    this.logger.log(`Room created :${roomId}`);

    return room;
  }

  getRoom(roomId: string): TMediaRoom | undefined {
    return this.rooms.get(roomId);
  }

  async getOrCreateRoom(roomId: string): Promise<TMediaRoom> {
    return this.getRoom(roomId) ?? this.createRoom(roomId);
  }

  deleteRoom(roomId: string) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.router.close();

    this.rooms.delete(roomId);

    this.logger.log(`Room deleted: ${roomId}`);
  }

  getRoomCount(): number {
    return this.rooms.size;
  }
}
