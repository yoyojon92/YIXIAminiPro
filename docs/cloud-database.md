# 微信云开发数据库结构

## 集合列表

### 1. users（用户集合）
```javascript
{
  "_id": "openid_xxx",           // 微信 openid
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "role": "user",                // user/distributor/agent/admin
  "schoolId": "school_001",      // 学校ID
  "ageVerified": false,          // 年龄验证状态
  "ageVerifyTime": null,         // 验证时间
  "idCardLast4": null,           // 身份证后4位（脱敏）
  "spiritCards": [],              // 已收集的精灵ID列表
  "fragments": {},               // 碎片数量 { spriteId: count }
  "totalSpent": 0,              // 累计消费
  "createdAt": 1704067200000,
  "updatedAt": 1704067200000
}
```

### 2. products（产品集合）
```javascript
{
  "_id": "prod_001",
  "name": "大吉大梨",
  "category": "pear_wine",      // pear_wine/strawberry_wine/pomegranate_wine/gift_box
  "price": 39.9,
  "originalPrice": 49.9,
  "alcohol": "8%vol",
  "specs": [
    { "id": "s1-330", "name": "330ml", "price": 39.9 }
  ],
  "tags": ["果酒", "低度酒", "送礼"],
  "images": [
    "cloud://xxx/banner1.jpg",
    "cloud://xxx/detail1.jpg"
  ],
  "sprite": {
    "id": "sprite_xiaoli",
    "name": "小梨",
    "rarity": "R",
    "emoji": "🍐"
  },
  "description": "精选山东莱阳梨，低温发酵...",
  "spiritStory": "小梨来自沂蒙山深处的梨园...",
  "manufacturer": null,          // 生产商，null表示自有产品
  "isAgentProduct": false,       // 是否代理产品
  "stock": 1000,
  "salesCount": 256,
  "rating": 4.8,
  "status": "on_sale",          // on_sale/off_sale
  "createdAt": 1704067200000,
  "updatedAt": 1704067200000
}
```

### 3. orders（订单集合）
```javascript
{
  "_id": "order_xxx",
  "orderNo": "YX20250115001",
  "userId": "openid_xxx",
  "items": [
    {
      "productId": "prod_001",
      "productName": "大吉大梨",
      "specId": "s1-330",
      "specName": "330ml",
      "price": 39.9,
      "quantity": 2,
      "subtotal": 79.8
    }
  ],
  "totalAmount": 79.8,
  "discountAmount": 0,
  "actualAmount": 79.8,
  "status": "pending",          // pending/paid/shipped/delivered/cancelled
  "deliveryType": "dormitory",   // dormitory/self_pickup
  "address": {
    "dormitory": "1号楼",
    "roomNumber": "101"
  },
  "pickupShop": null,
  "remark": "",
  "payTime": null,
  "shipTime": null,
  "deliverTime": null,
  "createdAt": 1704067200000,
  "updatedAt": 1704067200000
}
```

### 4. cart（购物车集合）
```javascript
{
  "_id": "cart_openid_xxx",
  "userId": "openid_xxx",
  "items": [
    {
      "id": "cart_item_001",
      "productId": "prod_001",
      "specId": "s1-330",
      "quantity": 2,
      "addedAt": 1704067200000
    }
  ],
  "updatedAt": 1704067200000
}
```

### 5. spirit_cards（精灵卡集合）
```javascript
{
  "_id": "sprite_xiaoli",
  "name": "小梨",
  "emoji": "🍐",
  "rarity": "R",                // N/R/SR/SSR/UR
  "flavor": "梨酒",
  "color": "#90EE90",
  "story": "小梨来自沂蒙山深处的梨园...",
  "personality": "清新自然、温柔治愈",
  "fragmentCount": 3,            // 合成所需碎片数
  "dropRate": 0.3,              // 掉落概率
  "relatedProducts": ["prod_001"],
  "createdAt": 1704067200000
}
```

### 6. fragments（碎片记录集合）
```javascript
{
  "_id": "frag_xxx",
  "userId": "openid_xxx",
  "spriteId": "sprite_xiaoli",
  "count": 1,
  "source": "order",             // order/diy/article/activity/reward
  "orderId": "order_xxx",
  "createdAt": 1704067200000
}
```

### 7. articles（软文集合）
```javascript
{
  "_id": "art_001",
  "title": "考试周的治愈小确幸",
  "summary": "期末考试压力大？让精灵们陪你...",
  "content": "完整文章内容...",
  "coverImage": "cloud://xxx/cover.jpg",
  "type": "diary",              // diary/festival/new_product/sprite_story
  "relatedProducts": ["prod_001"],
  "relatedSprite": "sprite_xiaoli",
  "readReward": 1,              // 阅读奖励碎片数
  "readCount": 1256,
  "likeCount": 89,
  "shareCount": 45,
  "authorId": "admin",
  "status": "published",        // draft/published
  "publishedAt": 1704067200000,
  "createdAt": 1704067200000
}
```

### 8. activities（活动集合）
```javascript
{
  "_id": "act_001",
  "title": "圣诞派对",
  "content": "活动详情...",
  "coverImage": "cloud://xxx/activity.jpg",
  "type": "offline",
  "startTime": 1705286400000,
  "endTime": 1705372800000,
  "location": "青岛农业大学体育馆",
  "maxParticipants": 100,
  "currentParticipants": 45,
  "price": 0,
  "organizerId": "distributor_001",
  "inviteReward": 1,
  "status": "open",
  "createdAt": 1704067200000
}
```

### 9. activity_registrations（活动报名集合）
```javascript
{
  "_id": "reg_xxx",
  "activityId": "act_001",
  "userId": "openid_xxx",
  "participants": 2,
  "totalAmount": 0,
  "inviteCode": "ABCD12",
  "invitedCount": 3,
  "status": "registered",
  "createdAt": 1704067200000
}
```

## 权限规则

### users（用户集合）
```json
{
  "read": true,
  "create": "doc._id == auth.openid",
  "update": "doc._id == auth.openid || auth.openid == 'admin'",
  "delete": "auth.openid == 'admin'"
}
```

### products（产品集合）
```json
{
  "read": true,
  "create": "auth.openid == 'admin'",
  "update": "auth.openid == 'admin'",
  "delete": "auth.openid == 'admin'"
}
```

### orders（订单集合）
```json
{
  "read": "doc.userId == auth.openid || auth.openid == 'admin'",
  "create": "doc.userId == auth.openid",
  "update": "doc.userId == auth.openid || auth.openid == 'admin' || doc.status == 'pending'",
  "delete": "doc.status == 'pending' && doc.userId == auth.openid"
}
```

### cart（购物车集合）
```json
{
  "read": "doc.userId == auth.openid",
  "create": "doc.userId == auth.openid",
  "update": "doc.userId == auth.openid",
  "delete": "doc.userId == auth.openid"
}
```

### spirit_cards（精灵卡集合）
```json
{
  "read": true,
  "create": "auth.openid == 'admin'",
  "update": "auth.openid == 'admin'",
  "delete": "auth.openid == 'admin'"
}
```

### fragments（碎片记录集合）
```json
{
  "read": "doc.userId == auth.openid",
  "create": "doc.userId == auth.openid",
  "update": false,
  "delete": false
}
```

### articles（软文集合）
```json
{
  "read": true,
  "create": "auth.openid == 'admin'",
  "update": "auth.openid == 'admin'",
  "delete": "auth.openid == 'admin'"
}
```

## 索引配置

建议创建的索引：
- users: `_id`（默认）
- products: `category`、`status`
- orders: `userId`、`status`、`createdAt`
- cart: `userId`（唯一索引）
- spirit_cards: `_id`（默认）
- fragments: `userId`、`spriteId`

## 数据初始化

部署云函数后，需要初始化产品数据和精灵数据：

```javascript
// 在 product/index.js 中，initProducts 函数会自动初始化
// 在首次调用时自动创建产品数据
```
