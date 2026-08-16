import { MediasoupModule } from "@media/modules/mediasoup/mediasoup.module";
import { ParticipantsService } from "@media/modules/mediasoup/participants/particcipants.service";
import { RoomsService } from "@media/modules/mediasoup/rooms/rooms.service";
import { Module } from "@nestjs/common";

import { SignalingGateway } from "./signaling.gateway";

@Module({
  imports: [MediasoupModule],
  providers: [SignalingGateway, RoomsService, ParticipantsService],
})
export class SignalingModule {}
