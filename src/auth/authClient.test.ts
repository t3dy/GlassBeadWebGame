import { describe, it, expect } from 'vitest';
import { isValidUsername, slugifyUsername, usernameToEmail } from './authClient';

describe('username identity helpers', () => {
  it('accepts well-formed usernames', () => {
    expect(isValidUsername('TedHand')).toBe(true);
    expect(isValidUsername('a_b-c.d')).toBe(true);
    expect(isValidUsername('magister7')).toBe(true);
  });

  it('rejects malformed usernames', () => {
    expect(isValidUsername('ab')).toBe(false);          // too short
    expect(isValidUsername('_leading')).toBe(false);    // must start alphanumeric
    expect(isValidUsername('has space')).toBe(false);   // no spaces
    expect(isValidUsername('x'.repeat(25))).toBe(false); // too long
  });

  it('slugifies to an address-safe, lowercase form', () => {
    expect(slugifyUsername('Ted Hand')).toBe('ted-hand');
    expect(slugifyUsername('Magister!')).toBe('magister');
    expect(slugifyUsername('  Trim.Me  ')).toBe('trim.me');
  });

  it('derives a deterministic synthetic login email', () => {
    expect(usernameToEmail('Ted Hand')).toBe('ted-hand@gbg.local');
    expect(usernameToEmail('Ted Hand')).toBe(usernameToEmail('ted hand')); // case/space-insensitive
  });
});
