# 邑夏小程序 Console报错修复指令

> 版本：v1.0 | 日期：2026-05-27
> 技术栈：Taro 4.1.9 + React 18 + TypeScript + TailwindCSS v4

---

## 任务：修复5个错误+25个警告+picsum外链替换

### 错误1：scroll-view 组件 padding 不支持

**原因**：微信小程序 `<scroll-view>` 不支持 `padding` 样式属性，需改用内层 `<View>` 包裹并设置 padding。

**修改文件**：

#### 1. src/pages/category/index.tsx
- 第132行：`<ScrollView className="mt-3" scrollX showScrollbar={false}>` 
  → 检查ScrollView及子元素是否使用了padding，如有则改为在外层View设padding

#### 2. src/pages/article/index.tsx
- 第96行：`<ScrollView>` 
  → 检查是否设了padding，改为在内层View设padding

#### 3. src/pages/runner/home.tsx
- 第226行：`<ScrollView scrollY className="h-screen pb-32">`
  → 检查pb-32是否触发了padding警告，改为在子View设paddingBottom

#### 4. src/pages/runner/register.tsx
- 第114行：`<ScrollView>`
  → 同上处理

#### 5. src/pages/wall/index.tsx
- 第288行：`<ScrollView scrollX showScrollbar={false}>`
  → 同上处理

#### 6. src/pages/wall/publish/index.tsx
- 第136行：`<ScrollView scrollY className="h-[calc(100vh-120px)]">`
  → 同上处理

#### 7. src/pages/dashboard/index.tsx
- 第32行：`<ScrollView className="min-h-screen bg-slate-900 pb-safe" scrollY>`
  → pb-safe可能触发padding警告，改为子View处理

**修复模式**：
```tsx
// ❌ 错误写法
<ScrollView className="p-4" scrollY>
  <View>内容</View>
</ScrollView>

// ✅ 正确写法
<ScrollView scrollY>
  <View className="p-4">内容</View>
</ScrollView>
```

---

### 错误2：页面路由错误

**可能原因**：app.config.ts注册了页面路径，但对应的页面文件不存在或编译后dist中缺失。

**排查步骤**：
1. 对比 `app.config.ts` 中的 pages 列表与 `dist/pages/` 下实际存在的js文件
2. 如果config中注册了但dist中无对应文件 → 检查源码中该页面是否存在
3. 常见缺失：新增的admin页面、runner相关页面、shipping相关页面

**修复**：确保每个注册的page路径都有对应的.tsx文件和.config.ts文件

---

### 错误3：渲染层错误

**可能原因**：
- 图片加载失败（picsum.photos被墙或加载慢）
- 组件渲染异常（undefined数据导致JSX报错）

**修复**：随picsum替换一并解决

---

### 核心修复：picsum.photos 外链替换（34处，8个文件）

**原则**：所有 `https://picsum.photos/xxx` 替换为本地emoji占位或本地资源路径，确保零外部图片依赖。

#### 文件1：src/store/adminStore.ts（3处）
```
行231: avatar: 'https://picsum.photos/100/100?random=1'  → avatar: '👤'
行248: avatar: 'https://picsum.photos/100/100?random=2'  → avatar: '👤'
行265: avatar: 'https://picsum.photos/100/100?random=3'  → avatar: '👤'
```
注：辅导员头像用emoji占位，如果UI需要图片则用本地assets路径

#### 文件2：src/store/ugcStore.ts（6处）
```
行151: image: 'https://picsum.photos/400/400?random=320'  → image: '/assets/images/ugc/default_1.jpg'
行170: image: 'https://picsum.photos/400/400?random=321'  → image: '/assets/images/ugc/default_2.jpg'
行190: image: 'https://picsum.photos/400/400?random=322'  → image: '/assets/images/ugc/default_3.jpg'
行209: image: 'https://picsum.photos/400/400?random=323'  → image: '/assets/images/ugc/default_4.jpg'
行229: image: 'https://picsum.photos/400/400?random=324'  → image: '/assets/images/ugc/default_5.jpg'
行248: image: 'https://picsum.photos/400/400?random=325'  → image: '/assets/images/ugc/default_6.jpg'
```
注：UGC内容图片用本地占位图，如果没有实际图片文件，改用emoji+文字占位：
```
image: '📸'  // 临时占位，后续用户上传真实图片
```

#### 文件3：src/pages/article/index.tsx（7处）
```
行51:  coverImage: 'https://picsum.photos/750/500?random=501'  → coverImage: '/assets/images/articles/cover_1.jpg'
行53:  authorAvatar: 'https://picsum.photos/100/100?random=301' → authorAvatar: '✍️'
行61:  image: 'https://picsum.photos/200/200?random=10'  → image: '🍷'
行62:  image: 'https://picsum.photos/200/200?random=11'  → image: '🧃'
行67:  image: 'https://picsum.photos/200/200?random=101' → image: '🖼️'
行237: src={`https://picsum.photos/200/200?random=60${i}`} → 改为使用产品Mock数据中的icon字段
```

#### 文件4：src/pages/orders/index.tsx（4处）
```
行59:  image: 'https://picsum.photos/100/100?random=10' → image: '🍑'
行72:  image: 'https://picsum.photos/100/100?random=11' → image: '🫐'
行85:  image: 'https://picsum.photos/100/100?random=12' → image: '🍓'
行86:  image: 'https://picsum.photos/100/100?random=13' → image: '🍋'
```
注：用产品对应emoji替代，后续可换成产品真实图片

#### 文件5：src/pages/diary/index.tsx（1处）
```
行31: coverImage: 'https://picsum.photos/750/400?random=501' → coverImage: '📖'
```

#### 文件6：src/pages/product/index.tsx（2处）
```
行23: avatar: 'https://picsum.photos/50/50?random=20' → avatar: '😊'
行24: avatar: 'https://picsum.photos/50/50?random=21' → avatar: '😊'
```

#### 文件7：src/pages/profile/index.tsx（1处）
```
行114: src="https://picsum.photos/100/100?random=30" → 改为使用用户头像的本地路径或emoji占位
```

#### 文件8：src/pages/activity/index.tsx（4处）
```
行30: coverImage: 'https://picsum.photos/750/400?random=401' → coverImage: '🎪'
行44: coverImage: 'https://picsum.photos/750/400?random=402' → coverImage: '🎉'
行58: coverImage: 'https://picsum.photos/750/400?random=403' → coverImage: '🥂'
行72: coverImage: 'https://picsum.photos/750/400?random=404' → coverImage: '🌙'
```

---

### 验证清单

```
[ ] grep -rn "picsum" src/ 返回0结果
[ ] 所有ScrollView的padding/pb/p-xxx移到内层View
[ ] pnpm validate 通过
[ ] pnpm build:weapp 成功
[ ] 微信开发者工具Console 0错误0警告
[ ] 所有页面正常渲染（无白屏）
[ ] 精灵图鉴页显示本地图片
[ ] 订单/文章/活动页图片正常显示（emoji占位或本地图片）
```

### 执行铁律

1. 修改已有文件用edit_file精确替换，禁止write_file覆盖
2. 替换picsum时，如果该字段类型是string（图片URL），用本地路径占位；如果是展示型小图，可以用emoji
3. ScrollView修复只改样式层，不改组件结构和逻辑
4. 每个文件改完后立即验证grep确认0残留
5. 全部改完后执行 pnpm validate + pnpm build:weapp
6. 构建成功后 git add -A && git commit -m "fix: 替换picsum外链+修复ScrollView padding警告" && git push
