import fs from 'node:fs';
import path from 'node:path';

const __dirname = import.meta.dirname;

export const updateVersionReporting = function () {
  try {
    const manifestPath = path.resolve(__dirname, '..', 'package.json');
    const filePath = path.resolve(__dirname, '..', 'src', 'devtools.js');
    const manifest = JSON.parse(fs.readFileSync(manifestPath));
    let found = false;
    let fileContents = String(fs.readFileSync(filePath));
    fileContents = fileContents
      .split('\n')
      .map((line) => {
        if (line.includes('vdtaVersion:')) {
          // `  sendToChild(win, { vdtaVersion: 'v0.0.8' });`
          let chunks = line;
          // ['  sendToChild(win, { vdtaVersion: ', 'v0.0.8', ' });']
          chunks = chunks.split('\'')
          // 'v0.0.8' => 'v0.0.9'
          chunks[1] = 'v' + manifest.version;
          // `  sendToChild(win, { vdtaVersion: 'v0.0.9' });`
          line = chunks.join('\'');
          found = true;
        }
        return line;
      })
      .join('\n');

    if (!found) {
      throw 'Could not find vdtaVersion';
    }

    fs.writeFileSync(filePath, fileContents);
  } catch (error) {
    console.log('Error updating library version in devtools.js');
    throw error;
  }
};
