import { optimize } from 'svgo/dist/svgo.browser.js';

export function svgo(svgInput: string, settings: any): { data: string } {
  // setup plugin list
  const floatPrecision = Number(settings.floatPrecision);
  const plugins = [];
  for (const [name, active] of Object.entries(settings.plugins)) {
    if (!active) continue;

    const plugin: any = {
      name,
      params: {},
    };

    // TODO: revisit this
    // 0 almost always breaks images when used on `cleanupNumericValues`.
    // Better to allow 0 for everything else, but switch to 1 for this plugin.
    plugin.params.floatPrecision = plugin.name === 'cleanupNumericValues' && floatPrecision === 0 ? 1 : floatPrecision;

    plugins.push(plugin);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data, error } = optimize(svgInput, {
    multipass: settings.multipass,
    plugins,
    js2svg: {
      indent: 2,
      pretty: true,
    },
  });

  if (error) throw new Error(error);

  return { data };
}
