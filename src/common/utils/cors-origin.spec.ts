import { getCorsOrigin } from './cors-origin';

describe('getCorsOrigin', () => {
  it('returns true when the value is empty after trim', () => {
    expect(getCorsOrigin('')).toBe(true);
    expect(getCorsOrigin('   ')).toBe(true);
  });

  it('returns a single trimmed origin', () => {
    expect(getCorsOrigin('https://app.example.com')).toEqual([
      'https://app.example.com',
    ]);
    expect(getCorsOrigin('  https://app.example.com  ')).toEqual([
      'https://app.example.com',
    ]);
  });

  it('splits comma-separated origins and trims each entry', () => {
    expect(getCorsOrigin('https://a.com, https://b.com')).toEqual([
      'https://a.com',
      'https://b.com',
    ]);
  });

  it('drops empty segments from the list', () => {
    expect(getCorsOrigin('https://a.com,, https://b.com,')).toEqual([
      'https://a.com',
      'https://b.com',
    ]);
  });
});
