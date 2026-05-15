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

const generateTTProjectConfig = (outputRoot: string) => {
  const config = {
    miniprogramRoot: './',
    projectname: 'coze-mini-program',
    appid: process.env.TARO_APP_TT_APPID || '',
    setting: {
      urlCheck: false,
      es6: false,
      postcss: false,
      minified: false,
    },
  };
  const outputDir = path.resolve(__dirname, '..', outputRoot);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.resolve(outputDir, 'project.config.json'),
    JSON.stringify(config, null, 2),
  );
};

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge, _env) => {
  const outputRootMap: Record<string, string> = {
    weapp: 'dist',
    tt: 'dist-tt',
    h5: 'dist-web',
  };
  const defaultOutputRoot = outputRootMap[process.env.TARO_ENV || ''] || 'dist';
  const outputRoot = process.env.OUTPUT_ROOT?.trim() || defaultOutputRoot;
  const isH5 = process.env.TARO_ENV === 'h5';

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
      patterns: [],
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
    onBuildFinish: ({ env, platforms, stats }) => {
      // 生成 project.config.json（仅生产模式）
      if (process.env.TARO_ENV === 'weapp' && env === 'production') {
        const weappAppid = process.env.TARO_APP_WEAPP_APPID || 'wx9127a9df7a4fd36d';
        const projectConfig = {
          miniprogramRoot: './',
          projectname: '邑夏',
          appid: weappAppid,
          setting: {
            urlCheck: false,
            es6: true,
            enhance: true,
            compileHotReLoad: true,
            postcss: false,
            minified: false,
          },
        };
        const distDir = path.resolve(__dirname, '..', outputRoot);
        if (!fs.existsSync(distDir)) { fs.mkdirSync(distDir, { recursive: true }); }
        fs.writeFileSync(
          path.resolve(distDir, 'project.config.json'),
          JSON.stringify(projectConfig, null, 2),
        );
        console.log('[config] ✓ 已生成 dist/project.config.json');
      }

      // WXSS兼容性修复（所有模式都执行）
      const distDir = path.resolve(__dirname, '..', outputRoot);
      const fixWxss = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            fixWxss(fullPath);
          } else if (entry.name.endsWith('.wxss')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let modified = false;

            // 修复1: @theme default{...} → page{...} + 提取@keyframes到顶层
            if (content.includes('@theme')) {
              const themeRegex = /@theme\s+default\s*\{/;
              const match = content.match(themeRegex);
              if (match) {
                const startIdx = match.index!;
                const openBraceIdx = startIdx + match[0].length - 1;
                let depth = 0;
                let endIdx = -1;
                for (let i = openBraceIdx; i < content.length; i++) {
                  if (content[i] === '{') depth++;
                  if (content[i] === '}') {
                    depth--;
                    if (depth === 0) { endIdx = i; break; }
                  }
                }
                if (endIdx > 0) {
                  const themeBlock = content.substring(openBraceIdx + 1, endIdx);
                  // 提取所有@keyframes块（包括-webkit-前缀）
                  const kfRegex = /@(?:-webkit-)?keyframes\s+\w+\s*\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g;
                  const keyframesBlocks: string[] = [];
                  let kfMatch;
                  while ((kfMatch = kfRegex.exec(themeBlock)) !== null) {
                    let kfBlock = kfMatch[0].replace(/@-webkit-keyframes/g, '@keyframes');
                    keyframesBlocks.push(kfBlock);
                  }
                  // 去掉@keyframes块，只保留CSS变量
                  const varsOnly = themeBlock.replace(kfRegex, '');
                  // 重建：page{变量} + 顶层@keyframes
                  const before = content.substring(0, startIdx);
                  const after = content.substring(endIdx + 1);
                  content = before + 'page{' + varsOnly.trim() + '}' + keyframesBlocks.join('') + after;
                  modified = true;
                  console.log('[config] ✓ 已修复 @theme → page + 提取@keyframes到顶层');
                }
              }
            }

            // 修复2: 残留的@-webkit-keyframes
            if (content.includes('@-webkit-keyframes')) {
              content = content.replace(/@-webkit-keyframes/g, '@keyframes');
              modified = true;
              console.log('[config] ✓ 已修复 @-webkit-keyframes → @keyframes');
            }

            // 修复3: \/ 转义字符
            if (content.includes('\\/')) {
              content = content.replace(/\\\//g, '/');
              modified = true;
              console.log('[config] ✓ 已修复 \\/ → /');
            }

            // 修复4: 残留的@tailwind/@layer指令
            if (content.includes('@tailwind') || content.includes('@layer')) {
              content = content.replace(/@tailwind\s+(base|components|utilities);?/g, '');
              content = content.replace(/@layer\s+(base|components|utilities)\s*\{[^}]*\}/g, '');
              modified = true;
              console.log('[config] ✓ 已移除残留的 @tailwind/@layer 指令');
            }

            if (modified) {
              fs.writeFileSync(fullPath, content);
              console.log('[config] ✓ 已修复 ' + entry.name + ' 的WXSS兼容性问题');
            }
          }
        }
      };
      if (fs.existsSync(distDir)) {
        fixWxss(distDir);
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

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});
