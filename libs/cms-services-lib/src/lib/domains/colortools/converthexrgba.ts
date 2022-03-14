export function rgba2hex(orig) {
  const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  const alpha = ((rgb && rgb[4]) || '').trim();
  const hex = rgb ? (rgb[1] | (1 << 8)).toString(16).slice(1) + (rgb[2] | (1 << 8)).toString(16).slice(1) + (rgb[3] | (1 << 8)).toString(16).slice(1) : orig;
  return { color: '#' + hex, opacity: alpha };
}
// if you want to convert hexToRgba
// import hexToRgba from 'hex-to-rgba';
