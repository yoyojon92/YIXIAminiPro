# 邑夏微信小程序 — Coze编程Agent上下文架构

> 版本：v2.0 | 制定时间：2026-05-15
> 核心原则：**做了才叫做了，说了不等于做了**

---

## ⛔ 铁律：防止"说是而不做"的三条规则

### 规则1：行动优先，禁止空承诺
- ❌ 错误："好的，我来修复" → 然后什么都没改
- ❌ 错误："确认没有localStorage问题" → 实际有9个store在用
- ✅ 正确：搜索 → 定位 → 修改代码 → 验证 → 推送

**每次收到修复指令，必须按此流程执行：**
```
1. 搜索定位：grep/findstr 找到所有相关代码位置
2. 逐个修改：对每个位置实际修改代码
3. 全局验证：再次搜索确认没有遗漏
4. 构建测试：pnpm validate && pnpm build:weapp
5. 推送代码：git add → commit → push
6. 汇报结果：列出修改了哪些文件+哪些行+改了什么
```

### 规则2：禁止"局部修复"，必须全局搜索
- ❌ 错误：只改了 `product/index.tsx` 一个文件的navigateTo，其他5个文件还有
- ✅ 正确：`grep -r "navigateTo" src/` 搜索所有文件，逐个检查修改

**所有涉及全局API的修复，必须搜索全项目：**

| 修复类型 | 搜索命令 | 必须改的位置 |
|---------|---------|------------|
| navigateTo→switchTab | `grep -r "navigateTo" src/` | 所有跳转tabbar页面的地方 |
| localStorage→Taro | `grep -r "localStorage\|sessionStorage" src/` | 所有存储调用 |
| 图片路径→require | `grep -r "/assets/images" src/` | 所有字符串图片引用 |
| confirmText超4字 | `grep -r "confirmText\|cancelText" src/` | 所有showModal调用 |
| @-webkit-keyframes | `grep -r "@-webkit-keyframes" dist/` | 构建产物 |

### 规则3：修复完成必须提供证据
每次修复后，回复必须包含：

```
## 修复报告

### 搜索结果
- 搜索命令：grep -r "xxx" src/
- 命中文件数：X个
- 命中位置列表：[文件:行号]

### 修改记录
- 文件1: 行XX → 改了什么
- 文件2: 行XX → 改了什么

### 验证结果
- pnpm validate: ✅/❌
- pnpm build:weapp: ✅/❌
- 再次搜索确认无遗漏: ✅/❌
```

---

## 🔧 项目运行环境（必须时刻记住）

### 这是微信小程序，不是H5！
微信WXSS是CSS的严格子集，以下特性**全部不支持**：
- `@theme` / `@tailwind` / `@layer` / `@apply` 指令
- `@-webkit-keyframes`（只认 `@keyframes`）
- `\/` 转义字符（如 `border-white\/10`）
- `:root` 选择器
- CSS嵌套（`@keyframes` 不能嵌套在其他规则块里）
- `normalize.css` 重置样式（@tailwind base 生成的）

### 微信小程序API限制
| 限制 | 说明 | 替代方案 |
|------|------|---------|
| 无 localStorage/sessionStorage | 微信没有浏览器存储API | `Taro.setStorageSync/getStorageSync/removeStorageSync` |
| showModal文字限制 | confirmText/cancelText最多4个中文字 | 控制字数≤4 |
| navigateTo不能跳tabbar | tabbar页面必须用switchTab | `Taro.switchTab({ url })` |
| 无 window/document | 不能用浏览器API | 用Taro提供的API |
| 图片路径不能中文 | 微信资源服务器对中文路径支持差 | 全英文命名 |
| 图片不能./相对路径 | 微信解析有问题 | 用绝对路径或require() |

### 技术栈（不能改）
- **Taro 4.1.9** + **webpack5**（不能用vite，有module not defined bug）
- **Tailwind CSS v4** + **weapp-tailwindcss v4** + **@tailwindcss/postcss v4**（不降级v3）
- **Zustand** + **persist中间件**（必须用taroStorage，不能用localStorage）
- **jsMinimizer: terser**（不能用esbuild，不支持ES5转换）

---

## 📁 项目文件结构（关键文件索引）

### 配置文件（不要动这些）
```
config/index.ts        → compiler: webpack5, jsMinimizer: terser, UnifiedWebpackPluginV5
config/dev.ts           → compiler: webpack5
config/prod.ts          → compiler: webpack5
babel.config.js         → compiler: webpack5
postcss.config.js       → @tailwindcss/postcss
package.json            → build:weapp = "taro build --type weapp && node scripts/fix-wxss.js"
```

### 自动修复脚本（已验证生效）
```
scripts/fix-wxss.js     → @theme→page{} + @keyframes提取 + 图片拷贝
src/store/taroStorage.ts → Taro.setStorageSync封装zustand persist
```

### 数据层（改产品在这里改）
```
src/mock/products.ts    → 8个产品的数据（价格/图片/规格/分类）
src/data/organLords.ts  → 5个器官达人数据（图片/故事/属性）
src/store/cartStore.ts  → 购物车store（已接persist+taroStorage）
src/store/userStore.ts  → 用户store
src/store/其他7个store   → 全部已接persist+taroStorage
```

### 页面文件
```
src/pages/index/          → 首页（分类入口+轮播+限时拼团）
src/pages/category/       → 分类页（tabbar页）
src/pages/product/        → 产品详情页
src/pages/cart/           → 购物车（tabbar页）
src/pages/sprites/        → 精灵页面
src/pages/profile/        → 我的（tabbar页）
src/pages/orders/         → 订单页
src/pages/runner/         → 跑腿员注册
src/pages/notifications/  → 通知页
```

### 图片资源
```
src/assets/images/products/yixia-products/  → 8张产品图（英文命名）
src/assets/images/spirits/                  → 5张精灵图
src/assets/images/organ-lords/              → 5张器官达人图
```

### TabBar页面列表（跳转这些必须用switchTab）
```
/pages/index/index     → 首页
/pages/category/index  → 分类
/pages/cart/index      → 购物车
/pages/profile/index   → 我的
```

---

## 🏗️ 构建流程

```bash
pnpm build:weapp
# 等价于：
# 1. taro build --type weapp    → webpack5编译src/到dist/
# 2. node scripts/fix-wxss.js   → 自动修复WXSS + 拷贝图片
```

构建后产物在 `dist/` 目录，微信开发者工具读取dist。

**不要手动改dist/！** 每次构建会覆盖。要改就改src/下的源码。

---

## 📋 分类映射关系（首页→分类页→产品）

首页4个分类入口必须正确映射到产品的分类字段：

| 首页入口 | 传参category值 | 对应产品ID | 产品名 |
|---------|---------------|-----------|--------|
| 果酒系列 | fruit_wine | prod_peach_001 ~ prod_grape_001 | 桃你欢心/楂香四溢/大吉大梨/似水榴年/葡写浪漫 |
| 粮食酒系列 | grain_wine | （暂无产品，预留） | — |
| NFC果汁系列 | nfc_juice | prod_nfc_peach_001 ~ prod_nfc_pear_001 | 鲜桃果汁/红葡萄果汁/鲜梨果汁 |
| 礼盒套装 | gift_box | （暂无产品，预留） | — |

**注意**：products.ts中每个产品必须有 `category` 字段，且值必须与首页传参一致！

---

## ✅ 修复前自查清单

每次收到修复指令后，先回答以下问题再动手：

1. **这个修复涉及哪些文件？** → 先grep搜索定位
2. **有没有类似的地方也需要修？** → 全局搜索同类型问题
3. **修改后会不会破坏已有功能？** → 不要动已验证通过的配置
4. **微信小程序是否支持这个API？** → 查上方的API限制表
5. **图片路径是否正确？** → 必须英文+require引用或绝对路径

---

## 🚫 禁止做的事

1. **禁止用onBuildFinish** → Taro 4.1.9的onBuildFinish不执行，用独立脚本+package.json链式命令
2. **禁止用vite编译** → 有module not defined bug
3. **禁止用esbuild压缩** → 不支持ES5转换
4. **禁止用localStorage** → 微信小程序没有这个API
5. **禁止中文图片路径** → 微信资源服务器不支持
6. **禁止navigateTo跳tabbar页** → 会报错
7. **禁止showModal文字超4字** → 会报错
8. **禁止不改代码就回复"已修复"** → 必须实际修改并验证
9. **禁止局部修复** → 必须全局搜索确保无遗漏
10. **禁止用字符串路径引用图片** → webpack不会追踪，用require()

---

## 📝 标准修复模板

收到修复指令后，按此模板回复：

```
## 执行计划

### 搜索定位
- [ ] grep搜索所有相关代码位置
- [ ] 列出命中文件和行号

### 修改执行
- [ ] 文件1: [具体修改内容]
- [ ] 文件2: [具体修改内容]
- [ ] ...

### 全局验证
- [ ] 再次grep确认无遗漏
- [ ] pnpm validate 通过
- [ ] pnpm build:weapp 通过

### 推送
- [ ] git commit + push

### 修复报告
| 文件 | 修改行 | 改了什么 |
|------|--------|---------|
| ... | ... | ... |
```

**先列出执行计划，确认后再动手修改。不要一上来就改代码！**
