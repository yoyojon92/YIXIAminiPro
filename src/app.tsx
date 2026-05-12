import { PropsWithChildren, useEffect } from 'react';
import { LucideTaroProvider } from 'lucide-react-taro';
import '@/app.css';
import { Toaster } from '@/components/ui/toast';
import { Preset } from './presets';

// 微信云开发初始化
if (process.env.TARO_ENV === 'weapp') {
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
