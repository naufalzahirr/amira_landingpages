import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const root = process.cwd();
const build = resolve(root, 'dist');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const allowed = new Set(['.html', '.css', '.js', '.png', '.webp', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.txt', '.xml', '.json']);
const files = [];

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink() || entry.name.startsWith('.')) {
      throw new Error(`Unexpected hidden file or symlink in build: ${path}`);
    }
    if (entry.isDirectory()) inspect(path);
    else if (!entry.isFile() || !allowed.has(extname(entry.name).toLowerCase())) {
      throw new Error(`Unexpected file type in build: ${path}`);
    } else files.push(path);
  }
}

if (!existsSync(join(build, 'index.html'))) throw new Error('Build dist/index.html before publishing.');
inspect(build);
if (!/^<!doctype html>/i.test(readFileSync(join(build, 'index.html'), 'utf8'))) {
  throw new Error('The generated index.html is incomplete.');
}
for (const file of files.filter((path) => ['.html', '.css'].includes(extname(path)))) {
  const text = readFileSync(file, 'utf8');
  const references = [...text.matchAll(/(?:src|href)="([^"]+)"|url\(["']?([^"'()]+)["']?\)/g)]
    .map((match) => match[1] || match[2]);
  for (const reference of references.filter((value) => value.startsWith('/') && !value.startsWith('//'))) {
    const pathname = decodeURIComponent(new URL(reference, 'https://amiraedu.com').pathname);
    if (!existsSync(resolve(build, `.${pathname}`))) {
      throw new Error(`Missing generated resource: ${reference}`);
    }
  }
}
console.log(`Verified ${files.length} static files; original PDFs and source files are excluded.`);
if (!process.argv.includes('--push')) process.exit(0);

const source = git(root, 'rev-parse', 'HEAD');
const parent = mkdtempSync(join(tmpdir(), 'amira-hosting-'));
const worktree = join(parent, 'publish');
const temporaryBranch = `amira-publish-${process.pid}-${Date.now()}`;
let added = false;
let orphan = false;

try {
  const remoteBranch = git(root, 'ls-remote', '--heads', 'origin', 'refs/heads/hosting');
  if (remoteBranch) {
    git(root, 'fetch', 'origin', 'refs/heads/hosting');
    git(root, 'worktree', 'add', '--detach', worktree, 'FETCH_HEAD');
  } else {
    git(root, 'worktree', 'add', '--orphan', '-b', temporaryBranch, worktree);
    orphan = true;
  }
  added = true;
  const tracked = git(worktree, 'ls-files').split('\n').filter(Boolean);
  if (tracked.some((path) => path !== 'README.md' && !path.startsWith('dist/'))) {
    throw new Error('The hosting branch contains unexpected files; refusing to replace them.');
  }

  rmSync(join(worktree, 'dist'), { recursive: true, force: true });
  cpSync(build, join(worktree, 'dist'), {
    recursive: true,
    filter: (path) => !path.endsWith('/.DS_Store'),
  });
  writeFileSync(join(worktree, 'README.md'), readFileSync(join(root, 'docs/HOSTING-BRANCH.md')));
  writeFileSync(join(worktree, 'dist/build-source.txt'), `${source}\n`);
  git(worktree, 'add', 'README.md', 'dist');
  if (!git(worktree, 'diff', '--cached', '--name-only')) {
    console.log('The hosting branch already contains this build.');
  } else {
    git(worktree,
      '-c', 'user.name=github-actions[bot]',
      '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      'commit', '-m', `Build AMIRA from ${source.slice(0, 7)}`);
    git(worktree, 'push', 'origin', 'HEAD:refs/heads/hosting');
    console.log(`Published hosting/dist from main commit ${source.slice(0, 7)}.`);
  }
} finally {
  if (added) git(root, 'worktree', 'remove', '--force', worktree);
  if (orphan) git(root, 'branch', '-D', temporaryBranch);
  rmSync(parent, { recursive: true, force: true });
}
