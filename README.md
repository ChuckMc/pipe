<!--
╔══════════════════════════════════════════════════════════════════════╗
║  DreamSeed 种梦计划 — AI创造者大赛  官方 README 模板                ║
║                                                                      ║
║  使用说明：                                                          ║
║  1. 将本模板放在参赛仓库根目录 README.md 的顶部                       ║
║  2. 头图使用 DreamField 官方公开活动图片地址                         ║
║  3. 请保留 DREAMFIELD_README_HEADER_START / END 标识                 ║
║  4. 分割线以下供创作者自由编写项目内容                               ║
╚═════════════════════════════════════��════════════════════════════════╝
-->

<!-- DREAMFIELD_README_HEADER_START -->

<p align="center">
  <a href="https://www.dreamfield.top">
    <img src="https://www.dreamfield.top/dream-field/contest-readme/assets/dreamseed-readme-banner.png" alt="DreamSeed 种梦计划参赛作品" width="100%" />
  </a>
</p>

<!-- DREAMFIELD_README_HEADER_END -->

# pipe

> Pipe terminal output to AI. Ask questions about any command output.

\`\`\`bash
cat build.log | pipe "Why did the build fail?"
kubectl get pods -A | pipe "Any pods in CrashLoopBackOff?"
tail -f server.log | pipe --watch "Alert me on ERROR or WARNING"
\`\`\`

[![npm](https://img.shields.io/npm/v/pipe-cli)](https://www.npmjs.com/package/pipe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Demo

\`\`\`
$ dmesg | pipe "Are there any hardware errors?"

✓ 3 hardware errors detected:
  • GPU reset (NVDA) × 2 — check temps
  • SATA link down on port 3 — check cable
  • USB overcurrent on port 6 — inspect physically
\`\`\`

---

## Install

\`\`\`bash
# One line (requires Node.js 18+)
npm install -g pipe-cli

# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...
\`\`\`

---

## Usage

\`\`\`bash
# Debug a build
cat build.log | pipe "What caused the error?"

# Analyze a server
curl -s https://api.example.com/health | pipe "Is everything healthy?"

# Real-time monitoring
tail -f server.log | pipe --watch "Detect errors and warnings"
\`\`\`

| Flag | Description |
|------|-------------|
| \`--watch\`, \`-w\` | Continuously analyze stdin as new data arrives |
| \`--model\`, \`-m\` | Claude model override |
| \`--help\`, \`-h\` | Show help |

---

## Why pipe?

**Before:** Copy output → open browser → paste → type question → wait → switch back
**With pipe:** \`cat log | pipe "why?"\` → answer in terminal. Done.

---

## License

MIT
