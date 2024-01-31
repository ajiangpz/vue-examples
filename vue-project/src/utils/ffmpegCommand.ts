export class Command {
  // 音视频分离
  splitAudio(path: string, videoName: string, format: string) {
    const audioPath = Command.genVideoAAC(path, videoName);
    const videoPath = `${path}${videoName}.${format}`;
    return {
      commands: [
        '-v',
        'quiet',
        '-i',
        videoPath,
        '-acodec',
        'copy',
        '-vn',
        audioPath,
      ],
      videoPath,
      audioPath,
      audioName: Command.genVideoAAC('', videoName),
    };
  }
  // 视频抽帧
  genFrame(
    filePath: string,
    framePath: string,
    size: { w: number; h: number },
    format = 'video',
    fps = 30,
  ) {
    if (format === 'gif') {
      const fileName = '/gif-%d.png';
      return {
        commands: [
          '-i',
          filePath,
          '-s',
          `${size.w}x${size.h}`,
          '-vf',
          'colorkey=white:0.01:0.0',
          `${framePath}${fileName}`,
        ],
      };
    } else {
      const fileName = '/pic-%d.jpg';
      return {
        commands: [
          '-i',
          filePath,
          '-vf',
          `fps=${fps}`,
          '-s',
          `${size.w}x${size.h}`,
          `${framePath}${fileName}`,
        ],
      };
    }
  }
  static genVideoAAC(path: string, videoName: string) {
    return `${path}${videoName}_A.aac`;
  }
}
