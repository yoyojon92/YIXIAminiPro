---
AIGC:
    Label: "1"
    ContentProducer: 001191110102MACQD9K64018705
    ProduceID: 7629647366345376000-data_volume/files/所有对话/主对话/CDN修正任务提示词.md
    ReservedCode1: ""
    ContentPropagator: 001191110102MACQD9K64028705
    PropagateID: 4496376016153680#1780467723749
    ReservedCode2: ""
---
# 邑夏小程序 - 图片路径CDN修正任务

## 目标
将小程序代码中所有本地图片路径（`/assets/images/...`）替换为CDN URL，解决主包37MB超限无法上传的问题。修改完成后push到GitHub。

## 仓库信息
- **GitHub仓库**：https://github.com/yoyojon92/YIXIAminiPro
- **分支**：main
- **最新commit**：45dbb02

## CDN替换规则
将所有 `'/assets/images/` 替换为 `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/`

注意：`'/assets/tabbar/` 开头的不改（tabbar图标必须本地）。

## 需要修改的文件（7个）

### 1. src/mock/products.ts
- 替换所有 `'/assets/images/products/` → `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/products/`
- 替换所有 `'/assets/images/organ-lords/` → 同上规则（organ-lords部分）

### 2. src/data/organLords.ts
- 替换所有 `'/assets/images/organ-lords/` → `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/organ-lords/`

### 3. src/pages/index/index.tsx
- 替换所有 `'/assets/images/products/` → CDN
- 替换所有 `'/assets/images/organ-lords/` → CDN

### 4. src/data/ipCharacters.ts
- 替换所有 `'/assets/images/ip/` → `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/ip/`

### 5. src/pagesSocial/sprites/index.tsx
- 替换所有 `'/assets/images/spirits/` → `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/spirits/`

### 6. src/mock/sprites.ts
- 替换所有 `'./assets/images/banner` → `'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@45dbb02/src/assets/images/banner`

### 7. config/index.ts
- copy.patterns中删除产品图片copy规则，只保留tabbar：
```typescript
    copy: {
      patterns: [
        // tabbar图标（小程序tabbar必须使用本地文件）
        { from: 'src/assets/tabbar/', to: 'dist/assets/tabbar/' },
      ],
      options: {},
    },
```

## 执行步骤
1. clone仓库到沙箱
2. 用sed或脚本批量替换上述7个文件
3. 验证：`grep -rn "'/assets/images/" src/ --include="*.ts" --include="*.tsx" | grep -v "cdn.jsdelivr" | grep -v "tabbar"` 应无结果
4. git add + commit + push

## commit信息
```
fix: 图片路径切回CDN-解决主包37MB超限
```

## 关键约束
- `'/assets/tabbar/` 不要改
- CDN hash用 `@45dbb02`（当前最新commit）
- git push时用PAT，push后立即清除credentials
- 不要动图片文件本身

---

> 本内容由 Coze AI 生成，请遵循相关法律法规及《人工智能生成合成内容标识办法》使用与传播。
