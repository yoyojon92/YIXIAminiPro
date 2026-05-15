#!/usr/bin/env node
/**
 * 微信小程序 WXSS 兼容性修复脚本
 * 修复 Tailwind CSS v4 编译后的 WXSS 兼容性问题
 */

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.log('[fix-wxss] dist 目录不存在，跳过修复');
  process.exit(0);
}

console.log('[fix-wxss] 开始修复 WXSS 文件...');

/**
 * 修复单个 WXSS 文件
 */
function fixWxssFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // 1. @theme default{...} → page{变量} + @keyframes 提取到顶层
  const themeIdx = content.indexOf('@theme default{');
  if (themeIdx >= 0) {
    const openBraceIdx = themeIdx + 14; // '@theme default{'.length
    let depth = 1;
    let closeBraceIdx = -1;

    for (let i = openBraceIdx; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          closeBraceIdx = i;
          break;
        }
      }
    }

    if (closeBraceIdx > 0) {
      const innerContent = content.substring(openBraceIdx, closeBraceIdx);
      const before = content.substring(0, themeIdx);
      const after = content.substring(closeBraceIdx + 1);

      // 提取所有 @keyframes 块
      const keyframesBlocks = [];
      const keyframeRanges = [];
      const keyframePattern = /@(?:-webkit-)?keyframes\s+[\w-]+\s*\{/g;
      let keyframeMatch;

      while ((keyframeMatch = keyframePattern.exec(innerContent)) !== null) {
        let keyframeDepth = 1;
        let keyframeCloseBrace = -1;

        for (let i = keyframeMatch.index + keyframeMatch[0].length - 1; i < innerContent.length; i++) {
          if (innerContent[i] === '{') keyframeDepth++;
          if (innerContent[i] === '}') {
            keyframeDepth--;
            if (keyframeDepth === 0) {
              keyframeCloseBrace = i;
              break;
            }
          }
        }

        if (keyframeCloseBrace > 0) {
          keyframeRanges.push({ start: keyframeMatch.index, end: keyframeCloseBrace + 1 });
          const kfBlock = innerContent.substring(keyframeMatch.index, keyframeCloseBrace + 1)
            .replace(/@-webkit-keyframes/g, '@keyframes');
          keyframesBlocks.push(kfBlock);
        }
      }

      // 从 innerContent 中移除 @keyframes 块，只保留 CSS 变量
      let varsOnly = innerContent;
      for (let i = keyframeRanges.length - 1; i >= 0; i--) {
        varsOnly = varsOnly.substring(0, keyframeRanges[i].start) + varsOnly.substring(keyframeRanges[i].end);
      }

      // 重建内容：page{变量} + 顶层 @keyframes
      content = before + 'page{' + varsOnly.trim() + '}' + keyframesBlocks.join('') + after;
      modified = true;
    }
  }

  // 2. @-webkit-keyframes → @keyframes
  if (content.includes('@-webkit-keyframes')) {
    content = content.replace(/@-webkit-keyframes/g, '@keyframes');
    modified = true;
  }

  // 3. \/ → /
  if (content.includes('\\/')) {
    content = content.replace(/\\\//g, '/');
    modified = true;
  }

  // 4. @tailwind 残留
  if (content.includes('@tailwind')) {
    content = content.replace(/@tailwind\s+(base|components|utilities);?/g, '');
    modified = true;
  }

  // 5. @layer 残留
  if (content.includes('@layer')) {
    content = content.replace(/@layer\s+\w+\s*\{[^}]*\}/g, '');
    modified = true;
  }

  // 6. @theme inline 残留
  if (content.includes('@theme')) {
    content = content.replace(/@theme\s+inline\s*\{[^}]*\}/g, '');
    modified = true;
  }

  // 7. display-p3 颜色（微信不支持）
  if (content.includes('display-p3')) {
    content = content.replace(/color\(display-p3[^)]*\)/g, '#888888');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('[fix-wxss] ✓ 已修复: ' + path.basename(filePath));
  }
}

/**
 * 递归遍历目录
 */
function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.wxss')) {
      fixWxssFile(fullPath);
    }
  }
}

// 执行修复
walkDir(distDir);

// 验证修复结果
const appWxssPath = path.resolve(distDir, 'app.wxss');
if (fs.existsSync(appWxssPath)) {
  const head = fs.readFileSync(appWxssPath, 'utf-8').substring(0, 30);
  console.log('[fix-wxss] app.wxss 开头: ' + head);

  if (head.includes('@theme')) {
    console.error('[fix-wxss] ✗ 修复失败！app.wxss 仍包含 @theme');
    process.exit(1);
  } else {
    console.log('[fix-wxss] ✓ 修复成功！');
  }
}

console.log('[fix-wxss] 完成！');
