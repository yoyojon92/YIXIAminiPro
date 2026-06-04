import { PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { LucideTaroProvider } from 'lucide-react-taro';
import '@/app.css';
import { Toaster } from '@/components/ui/toast';
import { Preset } from './presets';
import { useUserStore } from '@/store/userStore';

// 微信云开发初始化（开通云开发后替换为真实环境ID）
// if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
//   const { default: wx } = require('@tarojs/taro');
//   wx.cloud.init({
//     env: 'your-real-env-id', // 替换为真实云开发环境ID
//     traceUser: true
//   });
// }

const App = ({ children }: PropsWithChildren) => {
  // 微信扫码进入时自动提取邀请码
  // 小程序码参数格式: scene=inviter=DLXXXX 或 scene=DLXXXX
  const { setInviterCode, inviterCode } = useUserStore()
  
  if (!inviterCode) {
    try {
      const launchOpts = Taro.getLaunchOptionsSync()
      const scene = launchOpts.scene || ''
      // 从scene中提取邀请码
      const sceneStr = decodeURIComponent(String(scene))
      let code = ''
      if (sceneStr.startsWith('inviter=')) {
        code = sceneStr.replace('inviter=', '')
      } else if (sceneStr.startsWith('DL') || sceneStr.startsWith('YX')) {
        code = sceneStr
      }
      if (code) {
        setInviterCode(code)
      }
    } catch (e) {
      // 非微信环境忽略
    }
  }

  return (
    <LucideTaroProvider defaultColor="#000" defaultSize={24}>
      <Preset>{children}</Preset>
      <Toaster />
    </LucideTaroProvider>
  );
};

export default App;
