/**
 * optimize-images
 *
 * Converts new or replaced images in public/assets/images to WebP, resized and
 * compressed for where they are shown, and deletes the originals. Run it with
 * `npm run images`, or `npm run images -- --dry-run` to preview the changes.
 *
 * @author adrianpmdev
 */

import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = join(PROJECT_ROOT, 'public', 'assets', 'images');
const SOURCE_DIRS = [join(PROJECT_ROOT, 'src'), join(PROJECT_ROOT, 'public', 'assets', 'i18n')];

const INPUT_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.tif', '.tiff', '.avif']);
const KEEP_AS_IS = new Set([
  'system/favicon-32.png',
  'system/apple-touch-icon.png',
  'og-image.jpg',
]);

const RULES = [
  {
    name: 'App icon',
    test: (path) => path.startsWith('system/apps/'),
    resize: { width: 144, height: 144 },
    quality: 90,
  },
  {
    name: 'Desktop background',
    test: (path) => /^system\/background_xp\./.test(path),
    resize: { width: 2560 },
    quality: 78,
  },
  {
    name: 'Logo',
    test: (path) => /^system\/logo_xp\./.test(path),
    resize: { width: 440 },
    quality: 90,
  },
  {
    name: 'Avatar',
    test: (path) => /^system\/avatar_xp\./.test(path),
    resize: { width: 256, height: 256 },
    quality: 80,
  },
  {
    name: 'Web project preview',
    test: (path) => path.startsWith('webs/'),
    resize: { width: 1280 },
    quality: 80,
  },
  {
    name: 'Mobile screenshot',
    test: (path) => path.startsWith('mobile/'),
    resize: null,
    quality: 80,
  },
  { name: 'Other image', test: () => true, resize: { width: 1920 }, quality: 80 },
];

const dryRun = process.argv.includes('--dry-run');
const toPosix = (path) => path.split(sep).join('/');
const kb = (bytes) => `${bytes < 10240 ? (bytes / 1024).toFixed(1) : Math.round(bytes / 1024)} KB`;

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
    ),
  );
  return files.flat();
}

async function exists(path) {
  return stat(path).then(
    () => true,
    () => false,
  );
}

async function findReferences(fileNames) {
  if (fileNames.length === 0) return [];
  const sources = (await Promise.all(SOURCE_DIRS.map(listFiles)))
    .flat()
    .filter((f) => /\.(ts|html|scss|json)$/.test(f));
  sources.push(join(PROJECT_ROOT, 'src', 'index.html'));
  const found = [];
  for (const source of new Set(sources)) {
    const text = await readFile(source, 'utf8');
    for (const name of fileNames) {
      if (text.includes(name))
        found.push({ source: toPosix(relative(PROJECT_ROOT, source)), name });
    }
  }
  return found;
}

async function optimize(file) {
  const path = toPosix(relative(IMAGES_DIR, file));
  const rule = RULES.find((r) => r.test(path));
  const output = file.slice(0, -extname(file).length) + '.webp';
  const replaced = await exists(output);
  const before = (await stat(file)).size;

  let pipeline = sharp(file).rotate();
  if (rule.resize)
    pipeline = pipeline.resize({ ...rule.resize, fit: 'inside', withoutEnlargement: true });
  const { data, info } = await pipeline
    .webp({ quality: rule.quality })
    .toBuffer({ resolveWithObject: true });

  if (!dryRun) {
    await writeFile(output, data);
    await rm(file);
  }

  return {
    path,
    output: toPosix(relative(IMAGES_DIR, output)),
    rule: rule.name,
    status: replaced ? 'replaced' : 'new',
    size: `${info.width}x${info.height}`,
    before,
    after: data.length,
    originalName: path.split('/').pop(),
  };
}

const candidates = (await listFiles(IMAGES_DIR)).filter((file) => {
  const path = toPosix(relative(IMAGES_DIR, file));
  return INPUT_EXTENSIONS.has(extname(file).toLowerCase()) && !KEEP_AS_IS.has(path);
});

if (candidates.length === 0) {
  console.log(
    'No images to optimize. Drop PNG or JPG files into public/assets/images and run this again.',
  );
  process.exit(0);
}

console.log(dryRun ? 'Dry run: nothing will be changed.\n' : '');
const results = [];
let failed = 0;
for (const file of candidates) {
  try {
    const result = await optimize(file);
    results.push(result);
    console.log(
      `${result.status === 'new' ? 'NEW     ' : 'REPLACED'}  ${result.output}  (${result.rule}, ${result.size}, ${kb(result.before)} -> ${kb(result.after)})`,
    );
  } catch (error) {
    failed++;
    console.error(
      `FAILED    ${toPosix(relative(IMAGES_DIR, file))}: ${error.message} (original kept)`,
    );
  }
}

const saved = results.reduce((sum, r) => sum + r.before - r.after, 0);
console.log(
  `\n${results.length} image(s) ${dryRun ? 'would be ' : ''}optimized, ${kb(saved)} saved.`,
);

const references = await findReferences(results.map((r) => r.originalName));
if (references.length > 0) {
  console.log('\nThese files still point to the original names; change them to .webp:');
  for (const { source, name } of references) console.log(`  ${source}: ${name}`);
}

if (results.some((r) => r.path.startsWith('mobile/'))) {
  console.log(
    '\nMobile screenshots: check that width and height in mobile-projects-data.ts match the sizes above.',
  );
}

process.exit(failed > 0 ? 1 : 0);
