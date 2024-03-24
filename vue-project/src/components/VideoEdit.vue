<template>
  <div>{{ isFfmpegLoaded ? 'ffmpeg加载完成' : 'ffmpeg加载中' }}</div>
  <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :on-change="handleFileChange"> <template #trigger>
      <el-button type="primary">上传视频</el-button>
    </template></el-upload>

  <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :on-change="handleAudioChange"> <template #trigger>
      <el-button type="primary">上传音频</el-button>
    </template></el-upload>
  <el-button @click="getFrame">视频抽帧</el-button>
  <el-button @click="handleMerge">合成</el-button>
  <div class="video-wrapper">

    <video id="video" ref="videoDom" crossOrigin="anonymous" :src="videoState.videoList[0]?.videoUrl"
      style="padding: 3px; width: 100%; height: 100%"></video>
  </div>
  <div class="frame-wrapper">
    <img v-for="(frame, index) in videoState.videoList[0]?.frameList" :src="frame.url" :key="index"></img>
  </div>
</template>

<script lang="ts" setup>
import { useFfmpegLoaded } from '@/stores/useFfmpegLoaded';
import { useVideoState } from '@/stores/useVideoState';
import { ref, onMounted } from 'vue';
const videoState = useVideoState();
import { initVideo, getFirstFrame, gVideoFrame, mergeVideoAudio, initAudio } from '@/utils/ffmpegUtils';
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
    videoInfo: JSON.parse(videoInfo)
  }
}
async function getFrame() {
  const selectedVideo = videoState.videoList[videoState.videoList.length - 1];
  let tmp;
  try {
    tmp = await gVideoFrame(selectedVideo?.videoUrl, interval(selectedVideo?.duration), selectedVideo.fileName)
  } catch {
    return
  }
  selectedVideo.frameList = tmp;
  console.log(selectedVideo.frameList);
}
async function handleAudioChange(file: any) {
  await initAudio(file.raw);
}

async function handleMerge(){
  const videoUrl =await mergeVideoAudio();
  downloadBlob(videoUrl)
}

const downloadBlob = (blobUrl:string) => {
    // 创建一个示例的 Blob 对象

    // 创建 Blob URL

    // 创建一个隐藏的链接并设置下载属性
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'output.mp4'; // 设置下载文件的名称

    // 将链接添加到文档中
    document.body.appendChild(link);

    // 模拟点击下载链接
    link.click();

    // 清理 Blob URL
    URL.revokeObjectURL(blobUrl);
};
const videoDom = ref<HTMLVideoElement | null>(null);
onMounted(() => {
  videoDom.value!.addEventListener('loadeddata', () => {
    videoState.videoList[0].duration = videoDom.value!.duration;
  })
})

</script>

<style lang="scss">
.video-wrapper {
  width: 200px;
}

.frame-wrapper {
  img {
    width: 100px;
    display: inline-block;
    height: 100px;
  }
}
</style>
