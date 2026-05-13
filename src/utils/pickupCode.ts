// 生成6位取餐码（字母+数字混合）
export function generatePickupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 排除易混淆字符
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 格式化取餐码显示（如 AB-CD12）
export function formatPickupCode(code: string): string {
  return `${code.slice(0, 2)}-${code.slice(2, 4)}${code.slice(4)}`
}
