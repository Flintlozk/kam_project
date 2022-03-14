// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../wasm-codecs/resize/missing-types.d.ts" />

import { drawableToImageData } from './canvas';

const hasImageDecoder = typeof ImageDecoder !== 'undefined';

export async function isTypeSupported(mimeType: string): Promise<boolean> {
  if (!hasImageDecoder) return false;
  // Some old versions of this API threw here.
  // It only impacted folks with experimental web platform flags enabled in Chrome 90.
  // The API was updated in Chrome 91.
  try {
    return await ImageDecoder.isTypeSupported(mimeType);
  } catch (err) {
    return false;
  }
}

export async function decode(blob: Blob | File, mimeType: string): Promise<ImageData> {
  if (!hasImageDecoder) {
    throw Error(`This browser does not support ImageDecoder. This function should not have been called.`);
  }
  const decoder = new ImageDecoder({
    type: mimeType,
    // Non-obvious way to turn an Blob into a ReadableStream
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data: new Response(blob).body!,
  });
  const { image } = await decoder.decode();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return drawableToImageData(image);
}
