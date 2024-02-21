<template>
  <div>{{ isFfmpegLoaded ? 'ffmpeg加载完成' : 'ffmpeg加载中' }}</div>
  <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :on-change="handleFileChange"> <template #trigger>
      <el-button type="primary">select file</el-button>
    </template></el-upload>
  <el-button @click="getFrame">视频抽帧</el-button>
</template>

<script lang="ts" setup>
import { useFfmpegLoaded } from '@/stores/useFfmpegLoaded';
import { useVideoState } from '@/stores/useVideoState';
const videoState = useVideoState();
import { initVideo, getFirstFrame, gVideoFrame } from '@/utils/ffmpegUtils';
import { interval } from "@/utils/string";
const isFfmpegLoaded = useFfmpegLoaded().isFfmpegLoaded;
async function handleFileChange(file: any) {
  await initVideo(file.raw);
  const fileName = `video${+new Date()}`;
  const url = window.webkitURL.createObjectURL(file.raw);
  const { url: coverUrl, videoInfo } = await getFirstFrame(url, fileName);
  videoState.videoList[videoState.videoList.length - 1] = {
    videoUrl: url,
    coverUrl,
    fileName,
    videoInfo:JSON.parse(videoInfo)
  }
}

async function getFrame() {
  const selectedVideo = videoState.videoList[videoState.videoList.length - 1];
  let tmp;
  try {
    tmp = await gVideoFrame(selectedVideo.videoUrl, interval(selectedVideo.videoInfo?.duration), selectedVideo.fileName)
  }catch{
    return 
  }
  selectedVideo.frameList = tmp;
  console.log(selectedVideo);
  
}

</script>
