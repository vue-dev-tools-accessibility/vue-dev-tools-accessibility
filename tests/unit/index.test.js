import plugin from '../../index.js';

describe('Library', () => {
  test('Has Vue Plugin shape', () => {
    expect(Object.keys(plugin))
      .toEqual(['install']);

    expect(typeof(plugin.install))
      .toEqual('function');
  });
});
