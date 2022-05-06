import { extractUrls } from '../src/extractUrls';

describe('extractUrls', () => {
  const tests: [string, string[]][] = [
    ['', []],
    ['hello.world.com and hello.world', ['hello.world.com', 'hello.world']],
    [
      'something about http://example.org?q=1023. and so',
      ['http://example.org?q=1023'],
    ],
    ['my email is me@example.com', []],
    ['this is not a real address - example.foo', ['example.foo']],
    [
      'Youtube link is https://www.youtube.com/watch?v=eIaCYI1FxAE&ab_channel=TheLateShowwithStephenColbert',
      [
        'https://www.youtube.com/watch?v=eIaCYI1FxAE&ab_channel=TheLateShowwithStephenColbert',
      ],
    ],
    [
      'https://my.site.cool\nhttps://my.site.cool\nhttps://my.site.cool',
      ['https://my.site.cool', 'https://my.site.cool', 'https://my.site.cool'],
    ],
  ];
  test.each(tests)('%s should equal %s', (input, output) => {
    expect(extractUrls(input)).toEqual(output);
  });
});
