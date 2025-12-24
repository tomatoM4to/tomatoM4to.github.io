import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'public/img');

function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.warn(`Target directory does not exist: ${TARGET_DIR}`);
    return;
  }

  const dirList = fs.readdirSync(TARGET_DIR);

  for (const dir of dirList) {
    const dest = path.join(ROOT, 'public/img', dir);
    const imgList = fs.readdirSync(dest);
    for (const imgName of imgList) {
      const ext = path.extname(imgName);
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const fileName = path.parse(imgName).name;
        const inputPath = path.join(ROOT, 'public/img', dir, imgName);
        const outputPath = path.join(ROOT, 'public/img', dir, `${fileName}.webp`);
        sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath)
          .then(() => console.log(`💫 Converted: ${inputPath} -> ${outputPath}`))
          .catch((err) => console.error(`Error converting ${inputPath}:`, err))
      }
    }
  }
}
main();
