import * as fs from "fs-extra";
import * as path from "path";

import War3Map from "mdx-m3-viewer/dist/cjs/parsers/w3x/map"
import { compileMap, getFilesInDirectory, loadJsonFile, logger, toArrayBuffer, toBuffer } from "./utils";
import War3MapW3i from "mdx-m3-viewer/dist/cjs/parsers/w3x/w3i/file";

function main() {
  const config = loadJsonFile("config.json");
  const result = compileMap(config);

  if (!result) {
    logger.error(`Failed to compile map.`);
    return;
  }

  logger.info(`Creating w3x archive...`);
  if (!fs.existsSync(config.outputFolder)) {
    fs.mkdirSync(config.outputFolder);
  }

  const fileName = config.mapFolder.replace('.w3x', `-${config.version}.w3x`);
  const buildDir = `${config.outputFolder}/${fileName}`;
  const sourceDir = `./dist/${config.mapFolder}`;

  prepDirForCreate(buildDir, sourceDir, config.version);
  createMapFromDir(buildDir, sourceDir, config.version);
}

/**
 * Creates a w3x archive from a directory
 * @param output The output filename
 * @param dir The directory to create the archive from
 */
export function createMapFromDir(output: string, dir: string, verNum: string) {
  const map = new War3Map();
  const files = getFilesInDirectory(dir);

  updateStrings(
    files.find(filename => filename.indexOf(".wts") >= 0), 
    files.find(filename => filename.indexOf(".w3i") >= 0), 
    verNum
  );

  // logger.info("Resizing hashtable");
  map.archive.resizeHashtable(files.length);

  for (const fileName of files) {
    const contents = toArrayBuffer(fs.readFileSync(fileName));
    const archivePath = path.relative(dir, fileName);
    const imported = map.import(archivePath, contents);

    if (!imported) {
      logger.warn("Failed to import " + archivePath);
      continue;
    }
  }

  const result = map.save();

  if (!result) {
    logger.error("Failed to save archive.");
    return;
  }
  else {
    logger.info("Saved archive");
  }

  fs.writeFileSync(output, new Uint8Array(result));

}

export function prepDirForCreate(output: string, dir: string, verNum: string) {
  // Remove the minimap mmp
  const mmpDir = path.join(__dirname, "..", dir, "war3map.mmp");
  if (fs.existsSync(mmpDir)) {
    fs.unlinkSync(mmpDir);
  }

  // Duplicate the generated minimap blp
  const blpDir = path.join(__dirname, "..", dir, "war3mapMap.blp");
  if (fs.existsSync(blpDir)) {
    const copyDest = path.join(__dirname, "..", dir, "war3mapGenerated.blp");
    fs.renameSync(blpDir, copyDest);
  }

  // Duplicate the generated minimap blp
  const ddsDir = path.join(__dirname, "..", dir, "war3mapPreview.dds");
  if (fs.existsSync(ddsDir)) {
    const copyDest = path.join(__dirname, "..", dir, "war3mapMap.dds");
    fs.renameSync(ddsDir, copyDest);
  }
}

function updateStrings(wtsDir: string | undefined, w3iDir: string | undefined, verNum: string) {
  if (!wtsDir) throw Error("wts not found");
  if (!w3iDir) throw Error("w3i not found");

  let w3iBuffer = toArrayBuffer(fs.readFileSync(w3iDir));
  const w3i = new War3MapW3i();  
  w3i.load(w3iBuffer);
  w3i.name = `|cff627781Askellon|r v${verNum}`;
  w3iBuffer = w3i.save();
  fs.writeFileSync(w3iDir, toBuffer(w3iBuffer));
}

main();