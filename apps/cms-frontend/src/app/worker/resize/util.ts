/**
 * Throw an abort error if a signal is aborted.
 */
import { drawableToImageData } from './canvas';
import * as WebCodecs from './web-codecs';

export function assertSignal(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('AbortError', 'AbortError');
}

/**
 * Take a signal and promise, and returns a promise that rejects with an AbortError if the abort is
 * signalled, otherwise resolves with the promise.
 */
export async function abortable<T>(signal: AbortSignal, promise: Promise<T>): Promise<T> {
  assertSignal(signal);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('AbortError', 'AbortError')));
    }),
  ]);
}

/** If render engine is Safari */
export const isSafari = /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);

/**
 * Compare two objects, returning a boolean indicating if
 * they have the same properties and strictly equal values.
 */
export function shallowEqual(one: any, two: any) {
  for (const i in one) if (one[i] !== two[i]) return false;
  for (const i in two) if (!(i in one)) return false;
  return true;
}

async function decodeImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  const loaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(Error('Image loading error'));
  });

  if (img.decode) {
    // Nice off-thread way supported in Safari/Chrome.
    // Safari throws on decode if the source is SVG.
    // https://bugs.webkit.org/show_bug.cgi?id=188347
    await img.decode().catch(() => null);
  }

  // Always await loaded, as we may have bailed due to the Safari bug above.
  await loaded;
  return img;
}

/** Caches results from canDecodeImageType */
const canDecodeCache = new Map<string, Promise<boolean>>();

/**
 * Tests whether the browser supports a particular image mime type.
 *
 * @param type Mimetype
 * @example await canDecodeImageType('image/avif')
 */
export function canDecodeImageType(type: string): Promise<boolean> {
  if (!canDecodeCache.has(type)) {
    const resultPromise = (async () => {
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      const source = document.createElement('source');
      source.srcset = 'data:,x';
      source.type = type;
      picture.append(source, img);

      // Wait a single microtick just for the `img.currentSrc` to get populated.
      await 0;
      // At this point `img.currentSrc` will contain "data:,x" if format is supported and ""
      // otherwise.
      return !!img.currentSrc;
    })();

    canDecodeCache.set(type, resultPromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return canDecodeCache.get(type)!;
}

export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Response(blob).arrayBuffer();
}

export function blobToText(blob: Blob): Promise<string> {
  return new Response(blob).text();
}

const magicNumberMapInput = [
  [/^%PDF-/, 'application/pdf'],
  [/^GIF87a/, 'image/gif'],
  [/^GIF89a/, 'image/gif'],
  // eslint-disable-next-line no-control-regex
  [/^\x89PNG\x0D\x0A\x1A\x0A/, 'image/png'],
  [/^\xFF\xD8\xFF/, 'image/jpeg'],
  [/^BM/, 'image/bmp'],
  [/^I I/, 'image/tiff'],
  [/^II*/, 'image/tiff'],
  // eslint-disable-next-line no-control-regex
  [/^MM\x00*/, 'image/tiff'],
  [/^RIFF....WEBPVP8[LX ]/s, 'image/webp'],
  [/^\xF4\xFF\x6F/, 'image/webp2'],
  // eslint-disable-next-line no-control-regex
  [/^\x00\x00\x00 ftypavif\x00\x00\x00\x00/, 'image/avif'],
  // eslint-disable-next-line no-control-regex
  [/^\xff\x0a/, 'image/jxl'],
  // eslint-disable-next-line no-control-regex
  [/^\x00\x00\x00\x0cJXL \x0d\x0a\x87\x0a/, 'image/jxl'],
] as const;

export type ImageMimeTypes = typeof magicNumberMapInput[number][1];

const magicNumberToMimeType = new Map<RegExp, ImageMimeTypes>(magicNumberMapInput);

export async function sniffMimeType(blob: Blob): Promise<ImageMimeTypes | ''> {
  const firstChunk = await blobToArrayBuffer(blob.slice(0, 16));
  const firstChunkString = Array.from(new Uint8Array(firstChunk))
    .map((v) => String.fromCodePoint(v))
    .join('');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  for (const [detector, mimeType] of magicNumberToMimeType) {
    if (detector.test(firstChunkString)) {
      return mimeType;
    }
  }
  return '';
}

export async function blobToImg(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);

  try {
    return await decodeImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function builtinDecode(signal: AbortSignal, blob: Blob, mimeType: string): Promise<ImageData> {
  // If WebCodecs are supported, use that.
  if (await WebCodecs.isTypeSupported(mimeType)) {
    assertSignal(signal);
    try {
      return await abortable(signal, WebCodecs.decode(blob, mimeType));
    } catch (e) {}
  }
  assertSignal(signal);

  // Prefer createImageBitmap as it's the off-thread option for Firefox.
  const drawable = await abortable<HTMLImageElement | ImageBitmap>(signal, 'createImageBitmap' in self ? createImageBitmap(blob) : blobToImg(blob));
  return drawableToImageData(drawable);
}

export async function processSvg(signal: AbortSignal, blob: Blob): Promise<HTMLImageElement> {
  assertSignal(signal);
  // Firefox throws if you try to draw an SVG to canvas that doesn't have width/height.
  // In Chrome it loads, but drawImage behaves weirdly.
  // This function sets width/height if it isn't already set.
  const parser = new DOMParser();
  const text = await abortable(signal, blobToText(blob));
  const document = parser.parseFromString(text, 'image/svg+xml');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const svg = document.documentElement!;

  if (svg.hasAttribute('width') && svg.hasAttribute('height')) {
    return blobToImg(blob);
  }

  const viewBox = svg.getAttribute('viewBox');
  if (viewBox === null) throw Error('SVG must have width/height or viewBox');

  const viewboxParts = viewBox.split(/\s+/);
  svg.setAttribute('width', viewboxParts[2]);
  svg.setAttribute('height', viewboxParts[3]);

  const serializer = new XMLSerializer();
  const newSource = serializer.serializeToString(document);
  return abortable(signal, blobToImg(new Blob([newSource], { type: 'image/svg+xml' })));
}
