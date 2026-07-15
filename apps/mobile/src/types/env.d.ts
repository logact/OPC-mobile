declare module 'react-native-config' {
  export interface NativeConfig {
    OPC_SERVER_BASE_URL?: string;
    OPC_API_VERSION?: string;
    OPC_MQTT_BROKER_URL?: string;
  }

  const Config: NativeConfig;
  export default Config;
}

declare module 'process' {
  const process: {
    env: Record<string, string | undefined>;
    nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) => void;
  };
  export default process;
}
