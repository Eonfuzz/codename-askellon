import {exec, execFile, execSync} from "child_process";
import {loadJsonFile, logger, compileMap, IProjectConfig} from "./utils";

function runMap() {
  const config: IProjectConfig = loadJsonFile("config.json");
  const cwd = process.cwd();
  const filename = `${cwd}/dist/${config.mapFolder}`;

  logger.info(`Launching map "${filename.replace(/\\/g, "/")}"...`);

  if(config.winePath) {
    const wineFilename = `"Z:${filename}"`
    const prefix = config.winePrefix ? `WINEPREFIX=${config.winePrefix}` : ''
    execSync(`${prefix} ${config.winePath} "${config.gameExecutable}" ${["-loadfile", wineFilename, ...config.launchArgs].join(' ')}`, { stdio: 'ignore' });
  } else {
    execFile(config.gameExecutable, ["-loadfile", filename, ...config.launchArgs], (err: any) => {
      if (err && err.code === 'ENOENT') {
        logger.error(`No such file or directory "${config.gameExecutable}". Make sure gameExecutable is configured properly in config.json.`);
      }
    });
  }
}

runMap();