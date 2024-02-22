import { useFfmpegLoaded } from '@/stores/useFfmpegLoaded';
import { useVideoState } from '@/stores/useVideoState';
import { fetchFile, createFFmpeg } from '@FFmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  corePath: '/plugins/ffmpeg-core.js',
  log: true,
});
ffmpeg.load();

ffmpeg.setProgress((progress) => {
  console.log('🚀 ~ file: useFfmpeg.ts:16 ~ progress.ratio:', progress.ratio);
});

const videoInfo = {
  duration: '',
  bitRate: '',
};
ffmpeg.setLogger((logs) => {
  const ffmpegLoaded = useFfmpegLoaded();
  if (logs.type === 'info' && logs.message.includes('ffmpeg-core loaded')) {
    ffmpegLoaded.setFfmpegStatus(true);
  }
  if (logs.message.includes('Duration')) {
    videoInfo.duration = logs.message.slice(
      logs.message.indexOf('Duration:') + 'Duration: '.length,
      logs.message.indexOf(','),
    );
    videoInfo.bitRate = logs.message.slice(
      logs.message.indexOf('bitrate:') + 'bitrate: '.length,
    );
    console.log(videoInfo);
  }
});

let videoName = 'initVideo';

// 导入视频
export const initVideo = async (video: Blob) => {
  ffmpeg.FS('writeFile', videoName, await fetchFile(video));
  await ffmpeg.run('-i', videoName);
};
// 导入音频
let audioName = 'initAudio';
export const initAudio = async (audio: Blob) => {
  ffmpeg.FS('writeFile', audioName, await fetchFile(audio));
  await ffmpeg.run('-i', audioName);
};
// 合成音视频
export const mergeVideoAudio = async () => {
  // await initVideo(videoUrl);
  // await initAudio(audioUrl);
  const cmd = `-i ${videoName} -i ${audioName} -filter_complex [1:a]volume=0.3[a1];[0:a][a1]amix=inputs=2:duration=first[a] -map 0:v -map -c:v copy -c:a aac -y output.mp4`;
  await ffmpeg.run(...cmd.split(' '));
  const outputData = ffmpeg.FS('readFile', 'output.mp4');
  const outputBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
  return URL.createObjectURL(outputBlob);
};
// 下载视频
let fontName = 'font1';
/** ffmpeg导入字体 */
export const writeFontFile = async (font: Blob) => {
  ffmpeg.FS('writeFile', fontName, await fetchFile(font));
};

let imageName = 'imageMark';
/**ffmpeg导入贴图 */
export const writeImage = async (image: Blob) => {
  ffmpeg.FS('writeFile', imageName, await fetchFile(image));
};

let subTitle = 'subtitle.srt';
/**ffmpeg导入字幕文件 */
export const writeSubTitle = async (subtitle: Blob) => {
  ffmpeg.FS('writeFile', subTitle, await fetchFile(subtitle));
};

/**通过url获取文件blob数据 */
export const urlGetData = async (fileUrl: string, type = 'video/mp4') => {
  const tmp = 'tmpFile';
  ffmpeg.FS('writeFile', tmp, await fetchFile(fileUrl));
  const outputData = ffmpeg.FS('readFile', tmp);
  return new Blob([outputData.buffer], { type });
};

/** 获取视频的每一秒帧 */
export const gVideoFrame = async (
  fileUrl: string,
  timeArr: number[],
  videoName: string = 'initVideo',
) => {
  const frameDir = videoName;
  ffmpeg.FS('writeFile', videoName, await fetchFile(fileUrl));
  ffmpeg.FS('mkdir', frameDir + 'Frame');
  const videoState = useVideoState();
  const second = videoState.frameCount / timeArr[timeArr.length - 1];
  let cmd = `-i ${videoName} -vf fps=${second} -q:v 5 -s 320x240 -an -preset fast /${frameDir}Frame/%3d.jpeg -hide_banner`;
  let args = cmd.split(' ');
  await ffmpeg.run(...args);
  const fileList = ffmpeg.FS('readdir', '/' + frameDir + 'Frame');
  let urls: { url: string }[] = [];
  fileList.forEach((v) => {
    if (v !== '.' && v !== '..') {
      const path = frameDir + 'Frame' + '/' + v;
      const img = ffmpeg.FS('readFile', path);
      let url = URL.createObjectURL(
        new Blob([img.buffer], { type: 'image/jpeg' }),
      );
      urls.push({
        url,
      });
    }
  });
  return urls;
};
/** 获取视频的第一帧图片 */
export const getFirstFrame = async (
  fileUrl: string,
  fileName: string,
  initTime = '00:00:00.001',
) => {
  ffmpeg.FS('writeFile', fileName, await fetchFile(fileUrl));
  console.log('视频的第一帧图片');
  await ffmpeg.run(
    '-hwaccel',
    'auto',
    '-i',
    fileName,
    '-ss',
    initTime,
    '-vframes',
    '1',
    '-s',
    '640x480',
    '-an',
    '-threads',
    '4',
    '-preset',
    'fast',
    'output.jpg',
  );
  const data = ffmpeg.FS('readFile', 'output.jpg');
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'image/jpeg' }),
  );
  return {
    url,
    videoInfo: JSON.stringify(videoInfo),
  };
};
