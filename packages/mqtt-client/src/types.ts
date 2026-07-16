import type {
  MessageContent,
  Message,
  UplinkPayload,
  ServerEvent,
  MessageDeliveredEvent,
  ParticipantJoinedEvent,
  ParticipantLeftEvent,
  RoomUpdatedEvent,
} from '@opc/protocol';

export type {
  MessageContent,
  Message,
  UplinkPayload,
  ServerEvent,
  MessageDeliveredEvent,
  ParticipantJoinedEvent,
  ParticipantLeftEvent,
  RoomUpdatedEvent,
};

export type MqttConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface OpcMqttClientOptions {
  brokerUrl: string;
  participantId: string;
  token: string;
  clientId: string;
}

export interface OpcMqttClient {
  readonly state: MqttConnectionState;
  readonly error: Error | null;
  connect(): void;
  disconnect(): void;
  subscribeRoom(roomId: string): void;
  unsubscribeRoom(roomId: string): void;
  sendUplink(roomId: string, payload: UplinkPayload): void;
  onEvent(listener: (event: ServerEvent) => void): () => void;
  onStateChange(listener: (state: MqttConnectionState) => void): () => void;
  onError(listener: (error: Error) => void): () => void;
}
