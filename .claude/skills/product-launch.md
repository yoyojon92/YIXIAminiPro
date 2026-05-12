# 一键上新技能 (Product Launch Skill)

## 触发条件

当用户上传产品照片并发送 `"上新#数量"` 或类似指令时触发。

示例：
- "上新#1"
- "上传新产品"
- "添加新品"

## 执行流程

### Step 1: 识别产品信息

1. 分析用户上传的产品照片
2. 尝试识别以下信息：
   - 产品名称（读包装上的品牌名）
   - 品类（果酒/果汁/白酒）
   - 原料成分
   - 容量（ml）
   - 酒精度（%vol）
   - 价格

**如果无法识别**，必须询问用户获取以下信息：

| 字段 | 说明 |
|------|------|
| 产品名称 | 包装上的品牌名/系列名 |
| 品类 | 果酒 / 果汁 / 白酒 |
| 原料/口味 | 如：桃子、山楂、梨、石榴、葡萄 |
| 容量 | 如：275ml |
| 酒精度 | 如：8%vol（果酒），不填则为果汁 |
| 价格 | 销售价 |
| 划线价 | 如：19.8 |

**必须等待用户确认信息后才能继续。**

### Step 2: 处理图片

1. **创建目录**：
   ```bash
   mkdir -p public/assets/images/products/thumb
   ```

2. **生成产品主图**：
   - 尺寸：3:4 竖版
   - 格式：PNG（透明背景）
   - 保存到：`public/assets/images/products/{序号}-{品牌名}-{副标题}.png`
   - 示例：`public/assets/images/products/006-taohua-cherry.png`

3. **生成缩略图**：
   - 尺寸：81×81px
   - 背景：纯白
   - 保存到：`public/assets/images/products/thumb/{产品ID}-thumb.png`
   - 示例：`public/assets/images/products/thumb/prod_cherry_001-thumb.png`

**注意**：如果无法自动处理图片，需要告知用户手动处理或使用占位图。

### Step 3: 生成文案

**产品描述模板**（根据品类自动生成）：

果酒：
```
邑夏{口味}精灵果酒，精选优质{原料}，搭配金银花提取液，酒体清澈透亮，果香馥郁。入口甘甜醇厚，余韵悠长。8%vol微醺恰到好处，适合闺蜜小聚、独酌慢饮。每瓶275ml，轻松掌控微醺时刻。
```

果汁：
```
邑夏鲜榨{口味}果汁，甄选当季新鲜{原料}，全程冷链锁鲜。不添加人工色素和香精，保留水果最纯粹的香甜。入口清甜爽口，维C满满，每一口都是大自然的味道。适合早餐搭配、日常饮用。
```

白酒：
```
邑夏{香型}白酒，传承古法酿造技艺，固态发酵，自然陈酿。酒体醇厚绵柔，入口甘冽，回味悠长。适合商务宴请、礼赠亲友、收藏品鉴。
```

**精灵故事模板**（仅果酒）：
```
{精灵名}是邑夏世界的水精灵掌管者，负责守护{水果}的灵韵。她活泼可爱，热爱分享，每天都在研究如何让{水果}的美味传递给更多人。
```

### Step 4: 映射器官大人

**映射规则**（仅果酒）：

| 口味关键词 | 器官大人 |
|-----------|----------|
| 桃、蜜桃 | 脾将军 |
| 山楂、楂 | 肾智者 |
| 梨、鸭梨 | 肺丞相 |
| 石榴、榴 | 心君 |
| 葡萄、葡 | 肝谋士 |

**数据结构**（从 organLords.ts 获取）：
```typescript
const organLordMap = {
  '脾将军': organLords.find(o => o.name === '脾将军'),
  '肾智者': organLords.find(o => o.name === '肾智者'),
  '肺丞相': organLords.find(o => o.name === '肺丞相'),
  '心君': organLords.find(o => o.name === '心君'),
  '肝谋士': organLords.find(o => o.name === '肝谋士'),
}
```

**果汁/白酒**：`organLord: null`

### Step 5: 写入产品数据

**文件路径**：`src/mock/products.ts`

**追加新产品**（不改已有数据）：

```typescript
{
  id: 'prod_{关键词}_{序号}',  // 如：prod_peach_006
  name: '产品名称',
  subtitle: '副标题',
  category: '果酒' | '果汁' | '白酒',
  price: 17.8,
  originalPrice: 22.8,
  images: [
    '/assets/images/products/xxx.png',
    '/assets/images/products/thumb/xxx-thumb.png'
  ],
  description: '产品描述文案',
  rating: 4.9,
  sales: Math.floor(Math.random() * 1000) + 100,
  stock: 100,
  tags: ['果酒', '{口味}味', '新品'],
  specs: [
    { id: 'single', name: '单瓶', price: 17.8 },
    { id: 'double', name: '两瓶', price: 32.8 },
    { id: 'quad', name: '四瓶', price: 58.8 },
  ],
  flavors: ['{口味1}', '{口味2}', ...],  // 仅组合装
  isAlcohol: true,  // 果酒/白酒为true，果汁为false
  organLord: organLordMap['{角色名}'] || null,  // 仅果酒
}
```

**序号生成规则**：
- 统计 products.ts 中同类产品的数量 + 1
- 果酒从 001 开始
- 果汁从 001 开始
- 白酒从 001 开始

### Step 6: 验证

```bash
# 1. 类型检查
pnpm validate

# 2. 启动开发服务器
coze dev

# 3. 截图确认
# - 首页/分类页能看到新产品
# - 详情页显示正确的产品信息和器官大人
```

## 图片存储规范

| 类型 | 路径 | 命名规则 |
|------|------|----------|
| 产品主图 | `public/assets/images/products/` | `{序号}-{品牌名}-{副标题}.png` |
| 缩略图 | `public/assets/images/products/thumb/` | `{产品ID}-thumb.png` |
| 器官大人立绘 | `public/assets/images/organ-lords/` | `{角色ID}.jpg` |
| 精灵 | `public/assets/images/spirits/` | `{精灵ID}.jpg` |

## 禁止事项

- ❌ 修改已有产品数据
- ❌ 编造器官大人/精灵角色名
- ❌ 跳过 `pnpm validate` 验证
- ❌ 使用占位图作为正式产品图
- ❌ 跳过用户确认直接写入数据

## 示例对话

**用户**：上新#1 [上传图片]

**助手**：
> 已收到产品图片，正在识别信息...
>
> 无法自动识别以下信息，请确认：
> - 产品名称：？
> - 品类：果酒/果汁/白酒？
> - 价格：？

**用户**：果酒，山楂口味，29.8元，划线价39.8

**助手**：
> 正在处理...
> - 图片已保存
> - 产品文案已生成
> - 山楂→肾智者映射完成
> - 数据已写入
>
> ✅ pnpm validate 通过
> 截图确认中...
