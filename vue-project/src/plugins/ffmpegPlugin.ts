import FFManager from '@/utils/ffmpegManager';
import type { App } from 'vue';

const installFFmpeg = {
  install(app: App) {
    // 注册全局ffmpeg接口
    const ffmpegIns = new FFManager();
    ffmpegIns.init();
    app.provide('ffmpeg', ffmpegIns);
    console.log(ffmpegIns);
  },
};
export default installFFmpeg;
