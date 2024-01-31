<template>
  <video :src="video" controls />
  <br />
  <button @click="transcode">Start</button>
  <p>{{ message }}</p>
</template>

<script lang="ts" setup>
import type { LogEvent } from '@ffmpeg/ffmpeg/dist/esm/types';
import { ref, inject } from 'vue';
import type FFManager from '@/utils/ffmpegManager';
const ffmpeg = inject('ffmpeg') as FFManager;
const videoURL = '/video_2.mp4';
const message = ref('Click Start to Transcode');
let video = ref('');

async function transcode() {
  message.value = 'Loading ffmpeg-core.js';
  ffmpeg.setLogger(({ message: msg }: LogEvent) => {
    message.value = msg;
  });
  message.value = 'Start transcoding';
  await ffmpeg.writeFile(
    ffmpeg.pathConfig.resourcePath,
    'video_2.mp4',
    videoURL,
  );
  await ffmpeg.genFrame('video_2', 'mp4', {
    w: 1242,
    h: 30,
  });
  // await ffmpeg.run(['-i', 'test.avi', 'test.mp4']);
  // message.value = 'Complete transcoding';
  // const data = await ffmpeg.getFileBuffer('', 'test', 'mp4');
  // video.value = URL.createObjectURL(
  //   new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }),
  // );
}
</script>
