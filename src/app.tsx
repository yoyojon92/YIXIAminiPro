import { PropsWithChildren } from 'react';
import { LucideTaroProvider } from 'lucide-react-taro';
import '@/app.css';
import { Toaster } from '@/components/ui/toast';
import { Preset } from './presets';

// 微信云开发初始化（开通云开发后替换为真实环境ID）
// if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
//   const { default: wx } = require('@tarojs/taro');
//   wx.cloud.init({
//     env: 'your-real-env-id', // 替换为真实云开发环境ID
//     traceUser: true
//   });
// }

const App = ({ children }: PropsWithChildren) => {
  return (
    <LucideTaroProvider defaultColor="#000" defaultSize={24}>
      <Preset>{children}</Preset>
      <Toaster />
    </LucideTaroProvider>
  );
};

export default App;
