/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { builtinResize, BuiltinResizeMethod, drawableToImageData } from './canvas';
import WorkerBridge from './worker-bridge';

type BrowserResizeMethods = 'browser-pixelated' | 'browser-low' | 'browser-medium' | 'browser-high';
type WorkerResizeMethods = 'triangle' | 'catrom' | 'mitchell' | 'lanczos3' | 'hqx';

export const workerResizeMethods: WorkerResizeMethods[] = ['triangle', 'catrom', 'mitchell', 'lanczos3', 'hqx'];

export type Options = BrowserResizeOptions | WorkerResizeOptions | VectorResizeOptions;

export interface ResizeOptionsCommon {
  width: number;
  height: number;
  fitMethod: 'stretch' | 'contain';
}

export interface BrowserResizeOptions extends ResizeOptionsCommon {
  method: BrowserResizeMethods;
}

export interface WorkerResizeOptions extends ResizeOptionsCommon {
  method: WorkerResizeMethods;
  premultiply: boolean;
  linearRGB: boolean;
}

export interface VectorResizeOptions extends ResizeOptionsCommon {
  method: 'vector';
}

export const defaultOptions: Options = {
  // Width and height will always default to the image size.
  // This is set elsewhere.
  width: 2000,
  height: 2000,
  // This will be set to 'vector' if the input is SVG.
  method: 'lanczos3',
  fitMethod: 'stretch',
  premultiply: true,
  linearRGB: true,
};

export function getContainOffsets(sw: number, sh: number, dw: number, dh: number) {
  const currentAspect = sw / sh;
  const endAspect = dw / dh;

  if (endAspect > currentAspect) {
    const newSh = sw / endAspect;
    const newSy = (sh - newSh) / 2;
    return { sw, sh: newSh, sx: 0, sy: newSy };
  }

  const newSw = sh * endAspect;
  const newSx = (sw - newSw) / 2;
  return { sh, sw: newSw, sx: newSx, sy: 0 };
}

function browserResize(data: ImageData, opts: BrowserResizeOptions): ImageData {
  let sx = 0;
  let sy = 0;
  let sw = data.width;
  let sh = data.height;

  if (opts.fitMethod === 'contain') {
    ({ sx, sy, sw, sh } = getContainOffsets(sw, sh, opts.width, opts.height));
  }

  return builtinResize(data, sx, sy, sw, sh, opts.width, opts.height, opts.method.slice('browser-'.length) as BuiltinResizeMethod);
}

function vectorResize(data: HTMLImageElement, opts: VectorResizeOptions): ImageData {
  let sx = 0;
  let sy = 0;
  let sw = data.width;
  let sh = data.height;

  if (opts.fitMethod === 'contain') {
    ({ sx, sy, sw, sh } = getContainOffsets(sw, sh, opts.width, opts.height));
  }

  return drawableToImageData(data, {
    sx,
    sy,
    sw,
    sh,
    width: opts.width,
    height: opts.height,
  });
}

export interface SourceImage {
  file: File;
  decoded: ImageData;
  vectorImage?: HTMLImageElement;
}

export type ResizeOptions = BrowserResizeOptions | WorkerResizeOptions | VectorResizeOptions;

function isWorkerOptions(opts: ResizeOptions): opts is WorkerResizeOptions {
  return (workerResizeMethods as string[]).includes(opts.method);
}

export async function resize(signal: AbortSignal, source: SourceImage, options: ResizeOptions) {
  if (options.method === 'vector') {
    if (!source.vectorImage) throw Error('No vector image available');
    return vectorResize(source.vectorImage, options);
  }
  if (isWorkerOptions(options)) {
    const workerBridge = new WorkerBridge();
    return workerBridge.resize(signal, source.decoded, options);
  }
  return browserResize(source.decoded, options);
}
