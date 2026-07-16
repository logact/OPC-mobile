import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

// 默认指向测试环境；本地开发可通过 .env 文件覆盖
export const ENV = {
  serverBaseUrl:
    extra.OPC_SERVER_BASE_URL ??
    process.env.EXPO_PUBLIC_OPC_SERVER_BASE_URL ??
    'http://192.168.1.51:3000',
  apiVersion:
    extra.OPC_API_VERSION ??
    process.env.EXPO_PUBLIC_OPC_API_VERSION ??
    'v1',
  mqttBrokerUrl:
    extra.OPC_MQTT_BROKER_URL ??
    process.env.EXPO_PUBLIC_OPC_MQTT_BROKER_URL ??
    'mqtt://192.168.1.51:1883',
} as const;
