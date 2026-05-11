# 微信云开发迁移说明

## 项目结构

```
yixia-mini-program/
├── miniprogram/              ← 前端代码（供微信开发者工具导入）
│   ├── pages/                ← 页面文件
│   ├── components/           ← 组件
│   ├── utils/
│   │   └── cloudApi.js      ← 云函数调用封装 ⭐
│   ├── app.js               ← wx.cloud.init()
│   └── app.json
│
├── cloudfunctions/           ← 云函数目录（自动识别）
│   ├── user/                 ← 用户/登录云函数
│   ├── product/              ← 产品云函数
│   ├── order/                ← 订单云函数
│   └── cart/                 ← 购物车云函数
│
├── server/                   ← NestJS 后端（保留，可随时启用）
├── src/                      ← Taro 前端源码
├── dist/                    ← Taro 编译输出
└── docs/                    ← 文档
```

## 迁移步骤

### 1. 微信开发者工具配置

1. 打开微信开发者工具
2. 导入项目，选择 `miniprogram/` 目录
3. 设置 AppID
4. 在 `project.config.json` 中已配置 `cloudfunctionRoot: "./cloudfunctions/"`
5. 首次使用需要"上传并部署"所有云函数

### 2. 创建云环境

1. 登录微信公众平台
2. 进入"开发管理" → "开发设置" → 找到"低代码/云开发"
3. 开通云开发服务
4. 获取云环境 ID（如 `yixia-env-xxx`）
5. 在 `miniprogram/app.js` 中更新环境 ID

### 3. 初始化数据库集合

在微信开发者工具中：
1. 打开"云开发控制台"
2. 创建以下集合：
   - `users`
   - `products`
   - `orders`
   - `cart`
   - `spirit_cards`
   - `fragments`
   - `articles`
   - `activities`
3. 按照 `docs/cloud-database.md` 设置权限规则
4. 创建必要索引

### 4. 部署云函数

在微信开发者工具中：
1. 右键点击 `cloudfunctions/` 目录
2. 选择"上传并部署"
3. 依次部署：
   - `user` 云函数
   - `product` 云函数
   - `order` 云函数
   - `cart` 云函数

### 5. 初始化产品数据

调用产品列表接口会自动初始化产品数据：
```javascript
wx.cloud.callFunction({
  name: 'product',
  data: { action: 'list' }
})
```

## API 调用示例

### 登录
```javascript
import { callCloudFunction } from './utils/cloudApi'

// 微信登录
const { code } = await wx.login()

const res = await callCloudFunction('user', {
  action: 'login',
  code,
  nickname: '用户昵称'
})

if (res.code === 200) {
  // 保存 token
  wx.setStorageSync('token', res.data.token)
  wx.setStorageSync('userInfo', res.data.userInfo)
}
```

### 获取产品列表
```javascript
const res = await callCloudFunction('product', {
  action: 'list',
  category: 'pear_wine'
})

if (res.code === 200) {
  this.setData({ products: res.data })
}
```

### 创建订单
```javascript
const res = await callCloudFunction('order', {
  action: 'create',
  items: [
    { productId: '1', specId: 's1-330', quantity: 2 }
  ],
  deliveryType: 'dormitory',
  address: { dormitory: '1号楼', roomNumber: '101' }
})
```

## 环境切换

### 开发环境（本地 NestJS）
```javascript
// src/services/api.ts
const API_BASE = 'http://localhost:3000/api'
```

### 生产环境（微信云开发）
```javascript
// miniprogram/utils/cloudApi.js
const CLOUD_ENV = 'your-env-id' // 云环境ID
```

## 注意事项

1. **AppID 配置**：在 `project.config.json` 中替换为真实 AppID
2. **云环境 ID**：在 `miniprogram/app.js` 中配置
3. **权限规则**：按文档设置，确保数据安全
4. **年龄验证**：含果酒产品需要验证 18 岁以上，纯果汁不需要

## 回滚到 NestJS

如果需要回滚到 NestJS 后端：
1. 修改 `src/services/api.ts` 中的 API_BASE
2. 修改为 `http://localhost:3000/api`
3. 启动 NestJS 服务：`cd server && pnpm start:dev`

## 技术支持

- 微信云开发文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- 云数据库文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html
- 云函数文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html
