import fs from 'node:fs';
import path from 'node:path';

import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';
import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import type { PluginItem } from '@tarojs/taro/types/compile/config/project';
import dotenv from 'dotenv';
import devConfig from './dev';
import prodConfig from './prod';
import pkg from '../package.json';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge, _env) => {
  const outputRootMap: Record<string, string> = {
    weapp: 'dist',
    tt: 'dist-tt',
    h5: 'dist-web',
  };
  const defaultOutputRoot = outputRootMap[process.env.TARO_ENV || ''] || 'dist';
  const outputRoot = process.env.OUTPUT_ROOT?.trim() || defaultOutputRoot;

  const buildMiniCIPluginConfig = () => {
    const hasWeappConfig = !!process.env.TARO_APP_WEAPP_APPID;
    const hasTTConfig = !!process.env.TARO_APP_TT_EMAIL;
    if (!hasWeappConfig && !hasTTConfig) {
      return [];
    }
    const miniCIConfig: Record<string, any> = {
      version: pkg.version,
      desc: pkg.description,
    };
    if (hasWeappConfig) {
      miniCIConfig.weapp = {
        appid: process.env.TARO_APP_WEAPP_APPID,
        privateKeyPath: 'key/private.appid.key',
      };
    }
    if (hasTTConfig) {
      miniCIConfig.tt = {
        email: process.env.TARO_APP_TT_EMAIL,
        password: process.env.TARO_APP_TT_PASSWORD,
        setting: {
          skipDomainCheck: true,
        },
      };
    }
    return [['@tarojs/plugin-mini-ci', miniCIConfig]] as PluginItem[];
  };

  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'coze-mini-program',
    date: '2026-1-13',
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot,
    publicDir: 'public',
    plugins: ['@tarojs/plugin-generator', ...buildMiniCIPluginConfig()],
    defineConstants: {
      PROJECT_DOMAIN: JSON.stringify(
        process.env.PROJECT_DOMAIN ||
          process.env.COZE_PROJECT_DOMAIN_DEFAULT ||
          '',
      ),
      TARO_ENV: JSON.stringify(process.env.TARO_ENV),
    },
    copy: {
      patterns: [
        // tabbar图标（小程序tabbar必须使用本地文件）
        { from: 'src/assets/tabbar/', to: 'dist/assets/tabbar/' },
      ],
      options: {},
    },
    ...(process.env.TARO_ENV === 'tt' && {
      tt: {
        appid: process.env.TARO_APP_TT_APPID,
        projectName: 'coze-mini-program',
      },
    }),
    jsMinimizer: 'terser',
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: { enable: false },
    },
    mini: {
      webpackChain(chain) {
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [{
                appType: 'taro',
                rem2rpx: true,
                cssEntries: [path.resolve(__dirname, '../src/app.css')],
              }],
            },
          },
        });
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    // 构建完成后修复 WXSS 兼容性问题（开发模式和生产模式都执行）
    onBuildFinish: ({ error, isWatch }) => {
      console.log('[DEBUG] onBuildFinish triggered, isWatch=' + isWatch);
      if (error) {
        console.error('[fix] 构建有错误，跳过修复');
        return;
      }

      const distDir = path.resolve(__dirname, '..', outputRoot);
      if (!fs.existsSync(distDir)) {
        console.log('[DEBUG] distDir not exists');
        return;
      }

      // 修正 app.json：强制分包配置（Taro可能将分包页面平铺到pages里）
      if (process.env.TARO_ENV === 'weapp') {
        const appJsonPath = path.resolve(distDir, 'app.json');
        if (fs.existsSync(appJsonPath)) {
          const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
          const mainPages = [
            'pages/index/index',
            'pages/category/index',
            'pages/cart/index',
            'pages/profile/index',
            'pages/product/index',
          ];
          const subPackages = [
            { root: 'pagesOrder', pages: ['orders/index','order/success','payment/index','shipping-address/index','shipping/index','tracking/index','pickup/index','dormitory/index'] },
            { root: 'pagesRunner', pages: ['runner/home','runner/register','runner-list/index','runner-detail/index','runner-moment/index','runner-center/index'] },
            { root: 'pagesMember', pages: ['membership/index','points/index','recharge/index','withdraw/index','coupons/index'] },
            { root: 'pagesSocial', pages: ['sprites/index','wall/index','wall/publish/index','activity/index','diary/index','article/index','notifications/index','profile/user-profile/index'] },
            { root: 'pagesAdmin', pages: ['admin/index','admin/products','admin/counselor','admin/activity','admin/ip-manage','admin/user-profile','admin/links'] },
            { root: 'pagesExtra', pages: ['dashboard/index','stats/index'] },
          ];
          appJson.pages = mainPages;
          appJson.subPackages = subPackages;
          fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
          console.log('[fix] ✓ app.json 分包配置已修正: 主包5页 + 6分包');
        }
      }

      // 生成 project.config.json（仅 production）
      if (process.env.TARO_ENV === 'weapp' && process.env.NODE_ENV === 'production') {
        fs.writeFileSync(
          path.resolve(distDir, 'project.config.json'),
          JSON.stringify({
            miniprogramRoot: './',
            projectname: '邑夏',
            appid: process.env.TARO_APP_WEAPP_APPID || 'wxd006de892f57a2f5',
            setting: { urlCheck: false, es6: true, enhance: true, compileHotReLoad: true, postcss: false, minified: true },
          }, null, 2),
        );
      }

      // WXSS 修复（dev/prod 都执行）
      const fixWxssFile = (filePath: string) => {
        let c = fs.readFileSync(filePath, 'utf-8');
        let dirty = false;

        // 1. @theme default{...} → page{变量} + @keyframes 提取到顶层
        const ti = c.indexOf('@theme default{');
        if (ti >= 0) {
          const ob = ti + 14;
          let d = 1, cb = -1;
          for (let i = ob; i < c.length; i++) { if (c[i] === '{') d++; if (c[i] === '}') { d--; if (d === 0) { cb = i; break; } } }
          if (cb > 0) {
            const inner = c.substring(ob, cb);
            const before = c.substring(0, ti);
            const after = c.substring(cb + 1);
            // 提取 @keyframes 块
            const kfs: string[] = [];
            const kfRanges: { s: number; e: number }[] = [];
            const kp = /@(?:-webkit-)?keyframes\s+[\w-]+\s*\{/g;
            let km;
            while ((km = kp.exec(inner)) !== null) {
              let kd = 1, kcb = -1;
              for (let i = km.index + km[0].length - 1; i < inner.length; i++) {
                if (inner[i] === '{') kd++; if (inner[i] === '}') { kd--; if (kd === 0) { kcb = i; break; } }
              }
              if (kcb > 0) {
                kfRanges.push({ s: km.index, e: kcb + 1 });
                kfs.push(inner.substring(km.index, kcb + 1).replace(/@-webkit-keyframes/g, '@keyframes'));
              }
            }
            let vars = inner;
            for (let i = kfRanges.length - 1; i >= 0; i--) { vars = vars.substring(0, kfRanges[i].s) + vars.substring(kfRanges[i].e); }
            c = before + 'page{' + vars.trim() + '}' + kfs.join('') + after;
            dirty = true;
          }
        }

        // 2. @-webkit-keyframes → @keyframes
        if (c.includes('@-webkit-keyframes')) { c = c.replace(/@-webkit-keyframes/g, '@keyframes'); dirty = true; }

        // 3. \/ → /
        if (c.includes('\\/')) { c = c.replace(/\\\//g, '/'); dirty = true; }

        // 4. @tailwind 残留
        if (c.includes('@tailwind')) { c = c.replace(/@tailwind\s+(base|components|utilities);?/g, ''); dirty = true; }

        // 5. @layer 残留
        if (c.includes('@layer')) { c = c.replace(/@layer\s+\w+\s*\{[^}]*\}/g, ''); dirty = true; }

        // 6. @theme inline 残留
        if (c.includes('@theme')) { c = c.replace(/@theme\s+inline\s*\{[^}]*\}/g, ''); dirty = true; }

        if (dirty) {
          fs.writeFileSync(filePath, c);
          console.log('[fix] ✓ ' + path.basename(filePath));
        }
      };

      const walk = (dir: string) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) walk(p);
          else if (e.name.endsWith('.wxss')) fixWxssFile(p);
        }
      };
      walk(distDir);

      // 验证
      const appWxss = path.resolve(distDir, 'app.wxss');
      if (fs.existsSync(appWxss)) {
        const head = fs.readFileSync(appWxss, 'utf-8').substring(0, 20);
        console.log('[fix] app.wxss开头: ' + head);
        if (head.includes('@theme')) console.error('[fix] ✗ @theme未被替换！');
      }
    },
    h5: {
      publicPath: './',
      staticDirectory: 'static',
      router: {
        mode: 'hash',
      },
      devServer: {
        port: 5000,
        host: '0.0.0.0',
        open: false,
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
          },
        },
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        pxtransform: {
          enable: true,
          config: {
            platform: 'h5',
          },
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    rn: {
      appName: 'coze-mini-program',
      postcss: {
        cssModules: {
          enable: false,
        },
      },
    },
  };

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV;

  let config;
  if (process.env.NODE_ENV === 'development') {
    config = merge({}, baseConfig, devConfig);
  } else {
    config = merge({}, baseConfig, prodConfig);
  }
  
  // 确保 onBuildFinish 被添加到最终配置中
  config.onBuildFinish = baseConfig.onBuildFinish;

  return config;
});
