import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { reactive, watch, ref } from 'vue';
import { Command } from '@/utils/ffmpegCommand';
import { FileTypeMap } from '@/data/constant';
interface RunTask {
  instance: Promise<any>;
  commands: string[];
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}
const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
class FFManager {
  private ffmpeg: Record<string, any> = {}; // ffmpeg实例
  private runTask = reactive<RunTask[]>([]);
  private running = ref(false); // 运行状态
  public pathConfig = {
    resourcePath: '/resource/', // 资源目录，存放视频、音频等大文件
    framePath: '/frame/', // 持久化帧文件，用于轨道
    playFrame: '/pframe/', // 播放帧文件，因为文件体积大，可能会不定时删除
    audioPath: '/audio/', // 合成音频文件
    logPath: '/logs/', // 命令日志文件目录
    wavePath: '/wave/', // 音频波形文件目录
  };
  public baseCommand = new Command(); // 基础命令
  public showLog = true; // 是否打印输出
  constructor() {
    this.ffmpeg = new FFmpeg();
    watch(this.runTask, () => {
      this.startRun();
    });
  }
  async init() {
    await this.loadFF();
  }
  // 启动执行命令队列
  private startRun() {
    if (this.running.value || this.runTask.length === 0) {
      return;
    }
    this.running.value = true;
    this.loopRunTask();
  }
  // 遍历执行任务队列
  private async loopRunTask() {
    const runTask = this.runTask[0];
    if (!runTask) {
      this.running.value = false;
      return;
    }
    const { commands, resolve, reject } = runTask;

    const result = await this.ffmpeg.exec([...commands]);
    resolve(result);
    this.runTask.shift();
    if (this.runTask.length > 0) {
      await this.loopRunTask();
    } else {
      this.running.value = false;
    }
  }
  // 判断文件是否存在
  async fileExist(filePath: string, fileName: string) {
    const list = await this.readDir(filePath);
    console.log(list);

    return list?.indexOf(fileName);
  }
  // 读取目录
  async readDir(filePath: string) {
    return await this.ffmpeg.listDir(filePath);
  }
  // FS写文件
  async writeFile(
    filePath: string,
    fileName: string,
    fileUrl: string,
    force = false,
  ) {
    await this.ffmpeg.writeFile(
      `${filePath}${fileName}`,
      await fetchFile(fileUrl),
    );
    // this.logDir(filePath);
  }
  // 获取文件buffer
  getFileBuffer(filePath: string, fileName: string, format: string) {
    const localPath = `${fileName}.${format}`;
    return this.ffmpeg.readFile(`${filePath}${localPath}`);
  }
  // 打印目录
  logDir(filePath: string) {
    this.showLog && console.log(this.readDir(filePath));
  }
  // 初始化文件系统
  initFileSystem() {
    this.mkdir(Object.values(this.pathConfig));
  }
  // 创建目录
  mkdir(paths: string[]) {
    paths.forEach((filePath) => {
      this.ffmpeg.FS('mkdir', filePath);
    });
  }
  // 加载ffmpeg
  async loadFF() {
    return await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        'text/javascript',
      ),
    });
  }
  /**
   * 视频/gif 抽帧（全量，用于轨道）
   * */
  async genFrame(
    fileName: string,
    format: string,
    size: { w: number; h: number },
  ) {
    const framePath = `${this.pathConfig.framePath}${fileName}`;
    const filePath = `${fileName}.${format}`;
    // if (!this.fileExist(this.pathConfig.resourcePath, filePath))
    //   return { framePath };
    // if (this.fileExist(this.pathConfig.framePath, fileName))
    //   return { framePath };
    this.mkdir([framePath]);
    const { commands } = this.baseCommand.genFrame(
      `${this.pathConfig.resourcePath}${filePath}`,
      framePath,
      size,
      format,
    );
    await this.run(commands);
    return {
      framePath,
    };
  }
  // 获取视频帧图片
  getFrame(videoName: string, frameIndex: number) {
    const framePath = `${this.pathConfig.framePath}${videoName}`;
    const fileName = `/pic-${frameIndex}`;
    return this.getFileBlob(framePath, fileName, 'jpg');
  }
  // 获取文件Blob
  getFileBlob(filePath: string, fileName: string, format: string) {
    const fileBuffer = this.getFileBuffer(filePath, fileName, format);
    return new Blob([fileBuffer], {
      type: FileTypeMap[format as keyof typeof FileTypeMap],
    });
  }
  
  async splitAudio(videoName: string, format: string, force = false) {
    const { commands, audioPath, audioName } = this.baseCommand.splitAudio(
      this.pathConfig.resourcePath,
      videoName,
      format,
    );
    if (force || !this.fileExist(this.pathConfig.resourcePath, audioName)) {
      await this.run(commands);
    }
    return { audioPath, audioName };
  }
  run(commands: string[]) {
    const result = this.existCommand(commands);
    if (result) {
      return result.instance;
    } else {
      let task = { commands };
      const instance = new Promise((resolve, reject) => {
        Object.assign(task, {
          resolve,
          reject,
        });
      });
      this.runTask.push({
        instance,
        ...task,
      } as RunTask);
      return instance;
    }
  }
  existCommand(commands: string[]) {
    return this.runTask.find(
      (task) => task.commands.join('') === commands.join(''),
    );
  }
  setLogger(cb: Function) {
    this.ffmpeg.on('log', cb);
  }
  
}
export default FFManager;
