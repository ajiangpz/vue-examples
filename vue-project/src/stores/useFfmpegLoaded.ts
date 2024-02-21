import { ref } from 'vue';
import { defineStore } from 'pinia';
// 定义ffmpeg加载状态
export const useFfmpegLoaded = defineStore('ffmpegLoad', () => {
  const isFfmpegLoaded = ref(false);
  function setFfmpegStatus(status: boolean) {
    isFfmpegLoaded.value = status;
  }
  return { isFfmpegLoaded, setFfmpegStatus };
});
