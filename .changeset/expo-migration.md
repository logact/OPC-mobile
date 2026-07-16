---
"@opc/mobile": minor
---

Migrate mobile app to Expo Bare Workflow with EAS Build support and adopt GitHub Flow CI/CD

- Replace React Native CLI tooling with Expo Bare Workflow
- Add EAS Build configuration for cloud iOS/Android builds
- Migrate environment variables from react-native-config to Expo public env vars
- Update CI/CD to GitHub Flow: single main branch, Release workflow, EAS Build workflow
- Set iOS bundle identifier to com.logat.utralTodo (matching existing App Store Connect record) and Android package to com.logact.utralTodo
