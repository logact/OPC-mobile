import Config from 'react-native-config';

export const ENV = {
  serverBaseUrl: Config.OPC_SERVER_BASE_URL ?? 'http://localhost:3000',
  apiVersion: Config.OPC_API_VERSION ?? 'v1',
  mqttBrokerUrl: Config.OPC_MQTT_BROKER_URL ?? 'mqtt://localhost:1883',
} as const;
