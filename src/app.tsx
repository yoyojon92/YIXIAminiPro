import { PropsWithChildren } from 'react';
import { LucideTaroProvider } from 'lucide-react-taro';
import Taro from '@tarojs/taro';
import '@/app.css';
import { Toaster } from '@/components/ui/toast';
import { Preset } from './presets';

// 微信云开发初始化
if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  const { default: wx } = require('@tarojs/taro');
  wx.cloud.init({
    env: 'test-env-id',
    traceUser: true
  });
}

const App = ({ children }: PropsWithChildren) => {
  return (
    <LucideTaroProvider defaultColor="#000" defaultSize={24}>
      <Preset>{children}</Preset>
      <Toaster />
    </LucideTaroProvider>
  );
};

export default App;
