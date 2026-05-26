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
> 终端输出 → AI 分析。用自然语言问问题。

\`\`\`bash
cat build.log | pipe "Why did the build fail?"
cat build.log | pipe "构建为什么失败了？"
tail -f server.log | pipe --watch "报告 ERROR 和慢查询"
\`\`\`

[![npm](https://img.shields.io/npm/v/pipe-cli)](https://www.npmjs.com/package/pipe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

---

## Demo / 演示

\`\`\`
$ dmesg | pipe "检测到硬件错误了吗？"

✓ 检测到 3 个硬件错误：
  • GPU reset (NVDA) × 2 — 检查温度
  • SATA link down on port 3 — 检查线缆
  • USB overcurrent on port 6 — 检查物理接口
\`\`\`

---

## Install / 安装

\`\`\`bash
# One line / 一行安装
npm install -g pipe-cli

# Set your API key / 设置 API 密钥
export ANTHROPIC_API_KEY=sk-ant-...
\`\`\`

建议将 API 密钥加入 `~/.zshrc` 或 `~/.bashrc` 永久生效。

---

## Usage / 使用

### Debug / 调试

\`\`\`bash
# Ask in English
cat build.log | pipe "What caused the error?"

# 用中文提问
cat build.log | pipe "构建为什么失败了？有什么修复建议？"

# Analyze servers
curl -s https://api.example.com/health | pipe "Is everything healthy?"
\`\`\`

### Real-time monitoring / 实时监控

\`\`\`bash
# English prompt
tail -f server.log | pipe --watch "Detect errors and warnings"

# 中文提示
tail -f server.log | pipe -w "报告 ERROR 和慢查询"
\`\`\`

### Options / 选项

| Flag | Description | 说明 |
|------|-------------|------|
| \`-w\`, \`--watch\` | Continuously analyze stdin | 持续监听并实时分析 |
| \`-m\`, \`--model\` | Claude model override | 指定 Claude 模型 |
| \`--max-tokens\` | Max response tokens | 最大回复 token 数 |
| \`-h\`, \`--help\` | Show help | 显示帮助 |

---

## Why pipe? / 为什么用 pipe？

**Before / 之前：** Copy output → open browser → paste → type question → wait → switch back
**With pipe / 现在：** \`cat log | pipe "why?"\` → answer in terminal. Done. 全程留在终端。

---

## How it works / 原理

1. **pipe** reads stdin (or lets you paste content) / 读取 stdin（或交互粘贴）
2. Sends the output + your question to Claude / 将输出 + 问题发给 Claude
3. Streams the AI response to stdout / 将 AI 回复实时流式输出到终端

No config file. No daemon. No YAML. 零配置，一个命令。

---

## Use cases / 使用场景

### DevOps / SRE
\`\`\`bash
kubectl describe pod crash-pod | pipe "为什么这个 Pod 在崩溃？"
journalctl -u nginx --no-pager | pipe "Summary recent errors"
docker logs app-container --tail 200 | pipe "有内存问题吗？"
\`\`\`

### Development / 开发
\`\`\`bash
git diff main...HEAD | pipe "Review these changes for bugs"
cargo check 2>&1 | pipe "修复类型错误"
pnpm test 2>&1 | pipe "哪些测试失败了？原因是什么？"
\`\`\`

### Data analysis / 数据分析
\`\`\`bash
psql -c "EXPLAIN ANALYZE SELECT * FROM orders WHERE ..." | pipe \
  "这个查询优化了吗？建议加什么索引？"
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20 | pipe \
  "有可疑 IP 吗？"
\`\`\`

---

## License

MIT
