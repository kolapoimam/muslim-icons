import { execFileSync } from 'node:child_process';
import { assertReleaseRef } from './packages.mjs';
const ref = assertReleaseRef(process.env.RELEASE_REF ?? '');
const actual = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const expected = execFileSync('git', ['rev-parse', `${ref}^{commit}`], { encoding: 'utf8' }).trim();
if (actual !== expected) throw new Error('Checkout does not match the requested release ref');
console.log(`Verified release source ${actual}`);
