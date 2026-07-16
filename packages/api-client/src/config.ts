export interface OpcApiConfig {
  baseURL: string;
  /** @deprecated API 版本已内置于 @opc/protocol 的 API_ROUTES，无需再配置 */
  apiVersion?: string;
  timeout?: number;
}

export function buildBaseURL(config: OpcApiConfig): string {
  // API_ROUTES 已包含 /api/v1 前缀，因此 baseURL 只需服务器根地址
  return config.baseURL.replace(/\/$/, '');
}
