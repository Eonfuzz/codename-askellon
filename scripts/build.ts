import * as fs from "fs-extra";
import War3Map from "mdx-m3-viewer/src/parsers/w3x/map";
import War3MapW3i from "mdx-m3-viewer/src/parsers/w3x/w3i";
import War3MapWts from "mdx-m3-viewer/src/parsers/w3x/wts";
import * as path from "path";
import { compileMap, getFilesInDirectory, loadJsonFile, logger, toArrayBuffer, toBuffer } from "./utils";
import { FILE_EXISTS } from "mdx-m3-viewer/src/parsers/mpq/constants";

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

    // if (fileName.indexOf(".blp") !== -1 || fileName.indexOf(".mp3") !== -1) {
      const file = map.archive.files.find((e) => e.name === archivePath);
      if (file) {
        file.rawBuffer = contents;
        file.block.compressedSize = contents.byteLength;
        file.block.flags = FILE_EXISTS;
      }
    // }

    if (!imported) {
      logger.warn("Failed to import " + archivePath);
      continue;
    }
  }

  // logger.info("Saving archive...");
  const result = map.save();

  if (!result) {
    logger.error("Failed to save archive.");
    return;
  }
  else {
    // logger.info("Saved archive");
  }

  fs.writeFileSync(output, new Uint8Array(result));

  // logger.info("Finished!");
}

export function prepDirForCreate(output: string, dir: string, verNum: string) {
  // Remove the minimap mmp
  const mmpDir = path.join(__dirname, "..", dir, "war3map.mmp");
  if (fs.existsSync(mmpDir)) {
    fs.unlinkSync(mmpDir);
    logger.info("Prep: Removed preview overlay file");
  }
  else logger.warn("Prep: Could not find overlay file");

  // Duplicate the generated minimap blp
  const blpDir = path.join(__dirname, "..", dir, "war3mapMap.blp");
  if (fs.existsSync(blpDir)) {
    const copyDest = path.join(__dirname, "..", dir, "war3mapGenerated.blp");
    fs.renameSync(blpDir, copyDest);
    logger.info("Prep: Renamed minimap file");
  }
  else logger.warn("Prep: Could not find blp minimap file");

  // Duplicate the generated minimap blp
  const ddsDir = path.join(__dirname, "..", dir, "war3mapPreview.dds");
  if (fs.existsSync(ddsDir)) {
    const copyDest = path.join(__dirname, "..", dir, "war3mapMap.dds");
    fs.renameSync(ddsDir, copyDest);
    logger.info("Prep: Renamed dds minimap file");
  }
  else logger.warn("Prep: Could not find dds minimap file");
}

function getStringNumberFromString(whichString: string) {
  return Number(whichString.split("_")[1]);
}

function updateStrings(wtsDir: string, w3iDir: string, verNum: string) {
  logger.info("Updating strings in w3x");
  if (!wtsDir) throw Error("wts not found");
  if (!w3iDir) throw Error("w3i not found");

  const buffer = fs.readFileSync(w3iDir);
  if (!buffer) throw Error("w3i buffer not found");

  let w3iBuffer = toArrayBuffer(buffer);
  let wtsBuffer = fs.readFileSync(wtsDir, "utf8");

  logger.info("Pre w3i");
  const w3i = new War3MapW3i.File(w3iBuffer);
  logger.info("Pre wts");
  const wts = new War3MapWts.File(wtsBuffer);

  const w3iNameString = getStringNumberFromString(w3i.name);
  w3i.name = `${wts.stringMap.get(w3iNameString)} v${verNum}`;

  logger.info("Saving w3i");
  w3iBuffer = w3i.save();
  logger.info("Writing w3i");
  fs.writeFileSync(w3iDir, toBuffer(w3iBuffer));
  logger.info("Posting writing w3i");
}

// export function alterW3i(fileDir: string, versionNumber: string) {
//   try {
//     logger.info(`Applying version ${versionNumber}`);
//     w3i.name = `${w3i.name} v${versionNumber}`;
//     logger.info(`New name: ${w3i.name}`);
//     logger.info(`New desc: ${w3i.description}`);

//     w3iBuffer = w3i.save();
//     fs.writeFileSync(fileDir, toBuffer(w3iBuffer));
//   }
//   catch (e) {
//     console.error("ERROR applying ver number: "+e);
//   }
// }


// export function alterWts(fileDir: string, versionNumber: string) {
//   try {
//     const mapName = wts.load("TRIGSTR_012");
//     // w3i.name = `${w3i.name} v${versionNumber}`;
//     wts.stringMap.forEach((val, key) => {
//       logger.info(`${key}: ${val}`);
//     })
//   }
//   catch (e) {
//     console.error("ERROR applying wts name: "+e);
//   }
// }
main();