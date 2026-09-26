declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.css';

declare module 'crypto-browserify';

declare type MessageType = {
  type: string;
  payload: any;
};

declare interface ImageInfo {
  uuid: string;
  width: number;
  height: number;
  format: string;
  name: string;
  uintArray: Uint8Array;
  optimizationPercent: number;
  isSelected: boolean;
  size: number;
  setting: {
    colorProfile?: string;
    format: string;
    suffix?: string;
    constraint?: {
      type?: string;
      value?: number;
    };
  };
}

declare interface ImageOptimizationResult {
  uuid: string;
  name: string;
  base64Image: string;
  optimizedImageSize: number;
  format: string;
  sourceImageSize: number;
  pdfBuffer?: string;
}
