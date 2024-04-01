import type { Plugin } from 'vite';
// @ts-ignore
import { glob } from 'glob';
import fs from 'fs';
import vm from 'node:vm';
import url from 'url';

const context = {
  url,
  handler: () => {
    console.warn('servers 模块导入异常');
  }
};
vm.createContext(context);

function ViteProxyServer(): Plugin {
  return {
    name: 'vite:proxy-server',
    // 在解析 Vite 配置后调用。
    configResolved(config) { },
    // 是用于配置开发服务器的钩子
    configureServer(server) {
      // 添加响应头 COOP、COEP 支持wasm数据隔离
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
      });

      // 将 servers 下文件注册到接口
      const files = glob.sync('vitePlugins/server/**/*.js');
      console.log(files)
      console.log('****注册接口****');
      files.map((filePath: string) => {
        let urlPath = (filePath.match(/(?<=server).*(?=\.js)/) || [])[0];
        // 读取 filePath 代码 并使用 runIncontext 执行, 上下文为 context 
        // 在代码中重新定义handler 函数
        // 将其 作为url 的处理函数
        urlPath = urlPath.replace(/[\\/]+/g, '/');
        vm.runInContext(fs.readFileSync(filePath, 'utf-8'), context)
        console.log('****注册接口: ' + urlPath);
        server.middlewares.use(urlPath, context.handler);
      })
    }
  };
}

export default ViteProxyServer;
