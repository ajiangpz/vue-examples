import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
export type vT = {
  duration?: number;
  currentSecond?: number;
  tickCounts?: number;
  playStatus?: Boolean;
  id?: number;
  fileName?: string;
  videoInfo?: string;
  url?: string;
  videoUrl?: string;
  coverUrl?: string;
  frameList?: any[]; //视频帧
};
export const useVideoState = defineStore('videoState', () => {
  const videoList = reactive<[vT]>([
    {
      videoUrl: '',
      coverUrl: '',
    },
  ]);
  // videoList.pop();
  const videoSelected = ref(0);
  const fontList = reactive<any[]>([]);
  const imageList = reactive<any[]>([]);
  const subtitleList = reactive<any[]>([]);
  const frameCount = computed(() => {
    const videoInfo = videoList[videoSelected.value] || {};
    return videoInfo.duration! >= 20 ? 20 : Math.floor(videoInfo.duration!);
  });
  return { fontList, imageList, subtitleList, frameCount,videoList };
});
