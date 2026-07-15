# 开发指南

本仓库是 **OPC 移动端客户端**，采用 **React Native + pnpm monorepo + Expo Bare Workflow + GitHub Flow + changesets** 的管理方式：只有一个主分支 `main`，所有改动通过 PR 合并到 `main`，发布直接从 `main` 通过 changesets 计算版本并打 tag，构建走 EAS Build。

## 分支模型

```
feature/xxx ──┐
hotfix/xxx  ──┼──▶ main ──▶ tag vX.Y.Z ──▶ Release / EAS Build
feature/yyy ──┘  (主干分支)
```

| 分支 | 角色 | 代码状态 |
| --- | --- | --- |
| `main` | 唯一长期分支 | 最新功能；通过 CI 保护，必须 PR 合并 |
| `feature/*` | 功能开发 | 短命分支，合并后立即删除 |
| `hotfix/*` | 紧急修复 | 短命分支，合并后立即删除 |

## 版本号如何决定

**版本号不手填**，由 [changesets](https://github.com/changesets/changesets) 自动计算：

- 每个有用户可见变更的 PR 附带一个 `.changeset/*.md`（运行 `pnpm changeset` 交互式生成），声明 bump 级别（patch / minor / major）与摘要。
- 发布时运行 `Release` workflow，在 `main` 上执行 `pnpm changeset version`，按最高 bump 级别递增版本。
- 版本载体是 `apps/mobile/package.json`（根 `package.json` 由 workflow 同步）。
- `changeset version` 同时聚合生成 `apps/mobile/CHANGELOG.md`。

## 项目结构

```
.
├── apps/
│   └── mobile/          # React Native 客户端（Expo Bare Workflow）
│       ├── android/     # Android 原生工程
│       ├── ios/         # iOS 原生工程
│       ├── src/         # TypeScript / React 源码
│       ├── app.json     # Expo 配置
│       ├── eas.json     # EAS Build 配置
│       └── metro.config.js  # Metro（适配 pnpm monorepo + Node polyfills）
├── packages/            # 共享包（如 API client、MQTT client）
├── package.json
├── pnpm-workspace.yaml
└── .github/workflows/   # CI/CD
```

## 日常开发

1. 从 `main` 切出 feature 分支：
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/xxx
   ```

2. 开发并提交。如果改动对用户可见，添加 changeset：
   ```bash
   pnpm changeset
   ```

3. 发起 PR 到 `main`。
4. PR 触发 `ci.yml`：安装依赖 → 构建共享包 → bundle JS → typecheck / lint → 单元测试。
5. `changeset-check.yml` 会拦截没有新增 `.changeset/*.md` 的 PR；纯文档/CI/测试类改动可加 `no-changeset` label 豁免。
6. CI 通过后合并到 `main`，删除 feature 分支。

## 发布流程

1. 进入 Actions → **Release** workflow → Run workflow。
2. workflow 在 `main` 上执行 `pnpm changeset version`，计算新版本。
3. 自动提交 `chore: release X.Y.Z` 并推送回 `main`。
4. 自动打 tag `vX.Y.Z` 并推送。
5. 自动创建 GitHub Release。
6. 需要构建时，进入 Actions → **EAS Build** workflow → 选择 platform 和 profile 触发云端构建。

## 热修复流程

1. 从 `main` 切出 hotfix 分支：
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/xxx
   ```

2. 修复 bug，添加 patch changeset。
3. PR → `main`。
4. 合并后触发 **Release** workflow，发布 patch 版本。
5. 再用 **EAS Build** workflow 构建新版产物。

## 分支保护

- `main` 受保护：必须通过 PR 合并，且 `CI Done` 检查通过。
- 不允许 force push 或直接删除。
- `Release` workflow 会直接 push 到 `main`，需要为 `github-actions[bot]` 开启绕过保护规则。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动 Expo Metro
pnpm --filter @opc/mobile start

# Android
pnpm --filter @opc/mobile android

# iOS（macOS only）
pnpm --filter @opc/mobile ios

# 重新生成原生目录（修改了 app.json plugins 后执行）
pnpm --filter @opc/mobile prebuild
```

## 常用脚本

- `pnpm build` — 构建共享包
- `pnpm test` — 运行单元测试（Jest）
- `pnpm lint` / `pnpm typecheck` — 代码检查 / 类型检查
- `pnpm changeset` — 为当前改动添加 changeset

## CI/CD 说明

- `.github/actions/setup-pnpm`：统一安装 pnpm + Node + 依赖。
- `ci.yml`：PR / main push / tag push 时触发，负责构建、检查、测试。
- `ci-checks.yml` / `ci-test.yml`：被 `ci.yml` 复用的检查与测试子流程。
- `changeset-check.yml`：确保 main PR 携带 changeset。
- `release.yml`：手动触发，changeset 驱动的发版流程。
- `eas-build.yml`：手动触发，调用 EAS Build 进行云端 Android / iOS 构建。

## 环境变量

项目已改用 Expo 环境变量方案，不再使用 `react-native-config`。

复制 `apps/mobile/.env.example` 为 `apps/mobile/.env`：

```bash
EXPO_PUBLIC_OPC_SERVER_BASE_URL=http://localhost:3000
EXPO_PUBLIC_OPC_API_VERSION=v1
EXPO_PUBLIC_OPC_MQTT_BROKER_URL=mqtt://localhost:1883
```

生产环境使用 `EXPO_PUBLIC_OPC_MQTT_BROKER_URL=mqtts://...` 并配置 TLS。

EAS Build 中可通过 `eas.json` 的 `env` 字段或 GitHub Secrets/Variables 注入：

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_OPC_SERVER_BASE_URL": "https://..."
      }
    }
  }
}
```

## iOS 签名与 Apple Developer 配置

当前 Bundle Identifier 已设为 `com.logact.utralTodo`。

### 本地开发（Xcode 自动签名）

1. 打开 Xcode：
   ```bash
   open apps/mobile/ios/Mobile.xcodeproj
   ```
2. 选中 `Mobile` target → **Signing & Capabilities**
3. 勾选 **Automatically manage signing**
4. **Team** 选择你的 Apple Developer Team
5. Xcode 会自动在 Apple Developer Portal 创建 App ID 和 Provisioning Profile

### EAS Build 云端签名

EAS Build 不读取本地 Xcode 签名设置，需要单独配置 Apple 凭证：

1. 在 Expo 网站生成 Access Token：
   - https://expo.dev/settings/access-tokens
   - 复制 token 加到仓库 GitHub Secrets：`EXPO_TOKEN`

2. 在本地登录 EAS：
   ```bash
   cd apps/mobile
   pnpm exec eas login
   ```

3. 配置 EAS 项目（如尚未配置）：
   ```bash
   pnpm exec eas build:configure
   ```

4. 配置 iOS 凭证：
   ```bash
   pnpm exec eas credentials
   ```
   选择 iOS，按提示输入 Apple ID / App-Specific Password，EAS 会自动：
   - 创建/复用 App ID `com.logact.utralTodo`
   - 创建 Distribution 证书
   - 创建 Provisioning Profile
   - 上传到 Expo 云端

5. 触发 EAS Build：
   ```bash
   # 本地命令
   pnpm exec eas build --platform ios --profile preview

   # 或在 GitHub Actions 手动触发 EAS Build workflow
   ```

### 获取 Team ID（如需要手动填写）

在终端运行：

```bash
security find-identity -v -p codesigning
```

或在 [Apple Developer Membership](https://developer.apple.com/account/#!/membership) 页面查看 10 位 Team ID。

## 与 OPC-server 对接

OPC-mobile 通过 HTTP + MQTT 与 OPC-server 通信：

1. **注册/授权**：调用 `POST /api/v1/participants`，传入参与者 ID，返回 `participantId` + `token`。
2. **MQTT 连接**：使用 `participantId` 作为用户名、`token` 作为密码连接 broker。
3. **Topic 约定**：
   - 上行（客户端 → server）：`opc/rooms/{roomId}/uplink`，QoS 1
   - 下行（server → 客户端）：`opc/rooms/{roomId}/events`，QoS 1
4. **当前 server 发布的事件**：`message.delivered`（其他事件已定义但尚未发布）。

### 本地验证

```bash
# 1. 启动 OPC-server（在其仓库执行）
docker-compose up

# 2. 启动 Expo Metro
pnpm --filter @opc/mobile start

# 3. 运行 Android 或 iOS
pnpm --filter @opc/mobile android
pnpm --filter @opc/mobile ios
```

注册参与者后进入房间列表，选择房间即可收发实时消息。
