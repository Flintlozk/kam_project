import * as sharp from 'sharp';
import * as fs from 'fs';

export function resizeImageSharpFromFile(filepath: string, width: string, height: string): Promise<Buffer> {
  return sharpObject(filepath, width, height);
}

export function resizeImageSharpFromBuffer(buffer: Buffer, width: string, height: string, ext: string): Promise<Buffer> {
  return getObjectResize(buffer, width, height, ext);
}

function getExtension(filepath: string): string {
  const extArr = filepath.split('.');
  const ext = extArr[extArr.length - 1];
  return ext;
}

function resizeObject(width: number, height: number): { width?: number; height?: number } {
  if (width !== 0 && height === 0) {
    return { width: width };
  } else if (width === 0 && height !== 0) {
    return { height: height };
  } else if (width !== 0 && height !== 0) {
    return { width: width, height: height };
  }
}

function sharpObject(filepath: string, width: string, height: string): Promise<Buffer> {
  const ext = getExtension(filepath);
  if (ext === 'webp') {
    filepath = filepath.replace('.webp', '.jpg');
  }
  if (fs.existsSync(filepath.toString())) {
    return getObjectResize(getBufferFromFile(filepath), width, height, ext);
  } else {
    filepath = filepath.replace('.jpg', '.png');
    if (fs.existsSync(filepath)) {
      return getObjectResize(getBufferFromFile(filepath), width, height, ext);
    } else {
      return Promise.resolve(Buffer.from([]));
    }
  }
}

function getBufferFromFile(filepath: string): Buffer {
  const fileDataUTF8 = fs.readFileSync(filepath);
  const inputBuffer = Buffer.from(fileDataUTF8);
  return inputBuffer;
}

function getObjectResize(buffer: Buffer, width: string, height: string, ext: string): Promise<Buffer> {
  const sharpObjectInput = sharp(buffer);
  const resizeObj = resizeObject(Number(width), Number(height));
  switch (ext) {
    case 'png':
      return sharpObjectInput.resize(resizeObj).png().toBuffer();
    case 'webp':
      return sharpObjectInput.resize(resizeObj).webp().toBuffer();
    default:
      return sharpObjectInput
        .resize(resizeObj)
        .jpeg({
          quality: 90,
        })
        .toBuffer();
  }
}
