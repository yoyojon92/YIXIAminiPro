import type { UserConfigExport } from "@tarojs/cli"

export default {
  
  mini: {
    debugReact: true,
  },
  h5: {
    publicPath: '/',
  }
} satisfies UserConfigExport<'vite'>
