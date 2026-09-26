import { encode } from 'base64-arraybuffer-es6';

export const transformAndCompressData = (data: ImageInfo[]) => {
  return data.map((item) => ({
    uuid: item.uuid,
    format: item.format,
    name: item.name,
    optimizationPercent: item.optimizationPercent,
    base64Image: encode(item.uintArray as unknown as ArrayBuffer),
    settings: item.setting,
  }));
};
