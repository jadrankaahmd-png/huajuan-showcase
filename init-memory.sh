#!/bin/bash
# 每次启动自动确保记忆目录和文件可写
mkdir -p ~/.openclaw/workspace/memory
chown -R $(whoami) ~/.openclaw/workspace/
chmod -R 755 ~/.openclaw/workspace/
TODAY=$(date +%Y-%m-%d)
touch ~/.openclaw/workspace/memory/${TODAY}.md
touch ~/.openclaw/workspace/MEMORY.md
chmod 644 ~/.openclaw/workspace/memory/${TODAY}.md
chmod 644 ~/.openclaw/workspace/MEMORY.md
