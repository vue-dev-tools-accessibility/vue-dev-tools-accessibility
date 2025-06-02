import plugin from '../../index.js';

describe('Library', () => {
  test('Has Vite Plugin shape', () => {
    const Plugin = plugin();

    expect(Object.keys(Plugin))
      .toEqual(['name', 'transformIndexHtml']);

    expect(typeof(Plugin.transformIndexHtml))
      .toEqual('function');
  });
});
