#!/usr/bin/env node
// Release body from conventional commit subjects.
//   feat(export): add the native target emitters  ->  "- Add the native target emitters in export"
// Grouped into Features / Changes / Fixes, then the compare link.
import { execFileSync } from 'node:child_process';

const REPO = process.env.GITHUB_REPOSITORY || 'okdunli/rosezm';

const git = (args) => execFileSync('git', args, { encoding: 'utf8' });
const tag = process.argv[2] || process.env.GITHUB_REF_NAME;
if (!tag) {
  console.error('usage: node tools/release-notes.mjs <tag> [previous-tag]');
  process.exit(1);
}

let prev = process.argv[3] || '';
if (!prev) {
  const tags = git(['tag', '--sort=-v:refname']).split('\n').map((s) => s.trim()).filter(Boolean);
  const i = tags.indexOf(tag);
  if (i >= 0 && tags[i + 1]) prev = tags[i + 1];
}

// The first release compares against the root commit, not a tag.
const base = prev || git(['rev-list', '--max-parents=0', tag]).split('\n')[0].trim().slice(0, 7);

const subjects = git(['log', '--format=%s', `${base}..${tag}`])
  .split('\n').map((s) => s.trimEnd()).filter(Boolean);

const buckets = { Features: [], Changes: [], Fixes: [] };

// Only capitalize plain words: never touch `__rosezmAuth`, `post.reads`, `src/cli`.
const sentence = (s) => {
  const first = s.split(/\s+/)[0] || '';
  return /^[a-z]/.test(s) && !/[._/]/.test(first) ? s[0].toUpperCase() + s.slice(1) : s;
};

for (const s of subjects) {
  const m = /^([a-z]+)\(([^)]+)\):\s*(.+)$/.exec(s) || /^([a-z]+):\s*(.+)$/.exec(s);
  if (!m) {
    buckets.Changes.push(`- ${sentence(s)}`);
    continue;
  }
  const type = m[1];
  const subject = m[3] ?? m[2];
  const scope = m[3] === undefined ? '' : m[2];
  if (type === 'chore' && scope === 'release' && /^bump version\b/.test(subject)) continue;
  const head = type === 'feat' ? 'Features' : type === 'fix' ? 'Fixes' : 'Changes';
  buckets[head].push(scope ? `- ${sentence(subject)} in ${scope}` : `- ${sentence(subject)}`);
}

const blocks = [];
for (const h of ['Features', 'Changes', 'Fixes']) {
  if (buckets[h].length) blocks.push(`### ${h}\n${buckets[h].join('\n')}`);
}
blocks.push(`**Full Changelog**: https://github.com/${REPO}/compare/${base}...${tag}`);
process.stdout.write(`${blocks.join('\n\n')}\n`);
