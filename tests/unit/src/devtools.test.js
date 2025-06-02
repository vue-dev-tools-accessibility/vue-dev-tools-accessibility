import { setupDevtools } from '@/devtools.js';

describe('DevTools', () => {
  describe('Setup DevTools', () => {
    test('Returns nothing', () => {
      expect(setupDevtools())
        .toEqual(undefined);
    });
  });
});
