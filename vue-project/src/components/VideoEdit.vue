<template>
  <video :src="video" controls />
  <br />
  <button @click="transcode">Start</button>
  <button @click="draw">draw</button>
  <p>{{ message }}</p>

  <div ref="frameContainer" class="absolute top-0 left-0 right-0 h-full">
    <canvas v-bind="canvasAttr" ref="canvas" />
  </div>
</template>

<script lang="ts" setup>
import type { LogEvent } from '@ffmpeg/ffmpeg/dist/esm/types';
import { ref, inject, reactive, onMounted, nextTick } from 'vue';
import type FFManager from '@/utils/ffmpegManager';
const ffmpeg = inject('ffmpeg') as FFManager;
const videoURL = '/video/video_2.mp4';
const message = ref('Click Start to Transcode');
let video = ref('');
const canvas = ref();
const frameContainer = ref();
let trackItem = {
  cover: '/image/video/video_2.png',
  end: 150,
  format: 'mp4',
  fps: 30,
  frameCount: 150,
  height: 652,
  id: 't-91eb2599-6b8e',
  main: false,
  name: 'video_2',
  offsetL: 0,
  offsetR: 0,
  source: '/video/video_2.mp4',
  start: 0,
  time: 23733,
  type: 'video',
  width: 1242,
};
async function transcode() {
  message.value = 'Loading ffmpeg-core.js';
  ffmpeg.setLogger(({ message: msg }: LogEvent) => {
    message.value = msg;
  });
  message.value = 'Start transcoding';
  console.log('Start transcoding');
  await ffmpeg.writeFile(
    ffmpeg.pathConfig.resourcePath,
    `${trackItem.name}.${trackItem.format}`,
    videoURL,
  );
  console.log('finish writeFile');

  const path = await ffmpeg.genFrame(trackItem.name, trackItem.format, {
    w: trackItem.width,
    h: trackItem.height,
  });
  console.log('finish genFrame:', path);
}
let canvasContext = {} as CanvasRenderingContext2D;
const canvasAttr = reactive({
  width: 0,
  height: 0,
});
const drawSize = reactive({
  width: 0,
  height: 0,
  frameCount: 0,
  maxFrame: 1,
});
/**
 * @param imageBitmap 图像数据
 * @param start 开始位置
 * @param margin 图像间距
 * */
function drawBitmap(imageBitmap: ImageBitmap, drawIndex = 0, margin = 0) {
  const { width: containerWidth } = canvasAttr;
  const { width, height, maxFrame } = drawSize;
  const { width: imageW, height: imageH } = { width: 1224, height: 652 };
  if (drawIndex === maxFrame - 1) {
    // 最后一张顶头渲染
    canvasContext.drawImage(
      imageBitmap,
      0,
      0,
      imageW,
      imageH,
      containerWidth - width,
      0,
      width,
      height,
    );
  } else {
    canvasContext.drawImage(
      imageBitmap,
      0,
      0,
      imageW,
      imageH,
      drawIndex * (width + margin),
      0,
      width,
      height,
    );
  }
}
// 绘制图像
async function drawImage() {
  const { width: containerWidth } = canvasAttr;
  const { maxFrame, width, frameCount } = drawSize;
  const frameStep = Math.max(maxFrame - 1, 1); // 帧间距数，最小为1帧
  const renderSpace = Math.max(Math.floor(frameCount / frameStep), 1); // 间隔多少帧渲染一次
  let overFrame = Math.floor(frameCount - 1 - renderSpace * frameStep); // 不能整除时溢出帧数
  let offset = Math.max(containerWidth - Math.floor(maxFrame * width), 0); // 不够撑满canvas宽度的情况
  let marginSpace = Math.max(Math.round(offset / frameStep), 0); // 帧数不够填满容器时的间距
  let frameIndex = trackItem.offsetL + 1; // 开始下标
  for (let i = 0; i < maxFrame; i++) {
    const blobFrame = await ffmpeg.getFrame(trackItem.name, frameIndex);
    ((index, margin) => {
      createImageBitmap(blobFrame).then((imageBitmap) => {
        drawBitmap(imageBitmap, index, margin);
      });
    })(i, marginSpace);
    frameIndex = Math.min(frameIndex + renderSpace, frameCount);
    if (overFrame > 0) {
      frameIndex += 1;
      overFrame--;
    }
  }
}
// 设置 canvas 上下文环境
function setCanvasContext() {
  canvasContext = canvas.value.getContext('2d');
}
// 设置 canvas 大小
function setCanvasRect() {
  const { start, end, width: frameW, height: frameH } = trackItem;
  const showFrameCount = end - start;
  const { width, height } = frameContainer.value.getBoundingClientRect();
  canvasAttr.width = width;
  canvasAttr.height = height;
  const scaleW = Math.ceil(frameW / (frameH / height));
  drawSize.height = height;
  drawSize.width = scaleW;
  drawSize.frameCount = showFrameCount;
  drawSize.maxFrame = Math.min(Math.ceil(width / scaleW), showFrameCount);
  drawImage();
}
function draw() {
  nextTick(() => {
    setCanvasRect();
  });
}
onMounted(() => {
  setCanvasContext();
});
</script>
