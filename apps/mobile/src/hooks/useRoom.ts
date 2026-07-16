import { useCallback, useEffect } from 'react';
import { useRoomStore } from '../stores/roomStore';
import { useAuth } from './useAuth';
import { useMqtt } from '../contexts/MqttContext';
import type { UplinkPayload } from '@opc/mqtt-client';

export function useRoom() {
  const { participantId, token, clientId, isLoggedIn } = useAuth();
  const { connect, disconnect, client, state } = useMqtt();
  const store = useRoomStore();

  useEffect(() => {
    if (isLoggedIn && participantId && token && clientId) {
      connect(participantId, token, clientId);
    } else {
      disconnect();
    }
  }, [isLoggedIn, participantId, token, clientId, connect, disconnect]);

  useEffect(() => {
    if (store.currentRoomId) {
      client?.subscribeRoom(store.currentRoomId);
    }
    return () => {
      if (store.currentRoomId) {
        client?.unsubscribeRoom(store.currentRoomId);
      }
    };
  }, [store.currentRoomId, client]);

  // zustand actions 是稳定引用，直接解构即可，无需 useCallback
  const loadRooms = store.loadRooms;
  const enterRoom = store.enterRoom;
  const leaveRoom = store.leaveRoom;

  const sendText = useCallback(
    (roomId: string, text: string) => {
      if (!participantId || !client) return;

      const payload: UplinkPayload = {
        from: participantId,
        content: { type: 'text', body: text },
        clientMessageId: `${participantId}-${Date.now()}`,
      };
      client.sendUplink(roomId, payload);
    },
    [participantId, client],
  );

  return {
    rooms: store.rooms,
    currentRoomId: store.currentRoomId,
    messages: store.messages,
    isLoadingRooms: store.isLoadingRooms,
    isLoadingMessages: store.isLoadingMessages,
    error: store.error,
    mqttState: state,
    loadRooms,
    enterRoom,
    leaveRoom,
    sendText,
  };
}
