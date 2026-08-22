import { MediasoupModule } from "@/modules/mediasoup/mediasoup.module";
import { ParticipantsService } from "@/modules/mediasoup/participants/particcipants.service";
import { RoomsService } from "@/modules/mediasoup/rooms/rooms.service";
import { Module } from "@nestjs/common";

import { SignalingGateway } from "./signaling.gateway";

@Module({
  imports: [MediasoupModule],
  providers: [SignalingGateway, RoomsService, ParticipantsService],
})
export class SignalingModule {}
