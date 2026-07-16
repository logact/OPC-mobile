# OPC Mobile 项目代理指南

## 开发环境

- 测试服务器地址：`http://192.168.1.51:3000`
- OpenAPI 文档：`http://192.168.1.51:3000/openapi.json`
- MQTT 代理：`mqtt://192.168.1.51:1883`

## 说明

- 以上地址为项目测试环境，本地开发可通过 `apps/mobile/.env` 覆盖。
- OpenAPI 文档用于核对 `packages/api-client` 的接口、路径和类型定义。

## 版本对齐

客户端与 OPC-server 通过 `@opc/protocol` 共享契约：

- `packages/api-client` 和 `packages/mqtt-client` 依赖 `@opc/protocol`。
- HTTP 路由、MQTT topic、核心模型类型、上下行负载类型均从 `@opc/protocol` 导入，不再手写。
- `apps/server/src/server.ts` 的 OpenAPI `info.version` 已从 `@opc/server` 的 `package.json` 动态读取，避免文档版本与代码包版本脱节。

### 本地开发依赖

由于 `OPC-mobile` 与 `OPC-server` 是两个独立仓库，本地通过 `pnpm.overrides` 把 `@opc/protocol` 和 `@opc/core` 指向 OPC-server 的构建产物：

```json
// OPC-mobile/package.json
{
  "pnpm": {
    "overrides": {
      "@opc/core": "file:../OPC-server/packages/core",
      "@opc/protocol": "file:../OPC-server/packages/protocol"
    }
  }
}
```

改动 `OPC-server/packages/protocol/src` 后需要先构建：

```bash
# 在 OPC-server 仓库
pnpm -F '@opc/protocol' build
```

然后重新安装客户端依赖（让 pnpm 重新链接 file 依赖）：

```bash
# 在 OPC-mobile 仓库
pnpm install
```

### 长期发布

如果要支持 CI 或多机开发，应把 `@opc/core` 和 `@opc/protocol` 发布到 npm（或私有 registry），然后把 `pnpm.overrides` 替换为普通版本约束：

```json
{
  "dependencies": {
    "@opc/protocol": "^0.0.2"
  }
}
```

## 构建

修改 `packages/api-client` 或 `packages/mqtt-client` 后需要重新构建，以便 `apps/mobile` 能消费到最新类型：

```bash
pnpm -F '@opc/api-client' build
pnpm -F '@opc/mqtt-client' build
```
