# 邑夏小程序 - Banner点击修复 + 清苹微醉数据修正 + 场景图错位修复

## 修改文件1：src/pages/index/index.tsx

### 修复1：Banner点击跳转
找到bannerList数据（约第35-42行），给Banner添加action字段：

```typescript
const bannerList = [
  {
    id: 'new-banner',
    image: bannerNewImage,
    title: '新品上市',
    subtitle: '邑夏果酒系列全新登场',
    action: 'fruit_wine'  // 点击跳转到果酒分类
  }
]
```

然后找到Banner的onClick（约第160行）：
```typescript
<View className="w-full h-full" onClick={() => goToProduct(item.id)}>
```

改为：
```typescript
<View className="w-full h-full" onClick={() => {
  if (item.action) {
    Taro.setStorageSync('selectedCategory', item.action)
    Taro.switchTab({ url: '/pages/category/index' })
  }
}}>
```

## 修改文件2：src/mock/products.ts

### 修复2：清苹微醉数据修正
找到 `id: 'prod_apple_001'` 的产品，修改：
- name: '清苹微醺' → '清苹微醉'
- subtitle: '青苹果起泡酒' → '苹果金银花果酒'
- alcohol: '5%vol' → '7%vol'
- tags: ['果酒', '苹果酒', '新品', '起泡', '清肺'] → ['果酒', '苹果酒', '新品', '金银花', '清肺']

### 修复3：番红暗许数据修正
找到 `id: 'prod_guava_001'` 的产品，修改：
- subtitle: '番石榴红酒' → '番石榴金银花果酒'
- alcohol: '6%vol' → '7%vol'
- tags中的'安神' → '养心'（番石榴对应心）

### 修复4：榴红心事数据修正
找到 `id: 'prod_pomegranate_new'` 的产品，修改：
- subtitle: '石榴红酒' → '石榴金银花果酒'
- alcohol: '6%vol' → '7%vol'

### ⚠️ 不要改图片字段！不要改图片文件！

## 验证：
```bash
pnpm validate && pnpm build:weapp
git add -A && git commit -m "fix: Banner跳转修复+3款果酒数据修正(副标题/度数/标签)" && git push
```
