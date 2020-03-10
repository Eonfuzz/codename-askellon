const fs = require("fs-extra");
const War3TSTLHelper = require("war3tstlhelper");
const execFile = require("child_process").execFile;
const cwd = process.cwd();
const luamin = require('luamin');

// Parse configuration
let config = {};
try {
  config = JSON.parse(fs.readFileSync("config.json"));
} catch (e) {
  return console.error(e);
}

// Handle the operation
const operation = process.argv[2];

switch (operation) {
  case "build":
    const tsLua = "./dist/tstl_output.lua";

    if (!fs.existsSync(tsLua)) {
      return console.error(`Could not find "${tsLua}"`);
    }

    console.log(`Building "${config.mapFolder}"...`);
    fs.copy(`./maps/${config.mapFolder}`, `./dist/${config.mapFolder}`, function (err) {
      if (err) {
        return console.error(err);
      }

      // Merge the TSTL output with war3map.lua
      const mapLua = `./dist/${config.mapFolder}/war3map.lua`;

      if (!fs.existsSync(mapLua)) {
        return console.error(`Could not find "${mapLua}"`);
      }

      try {
        let contents = fs.readFileSync(mapLua) + fs.readFileSync(tsLua);
        if (config.minifyScript) {
          console.log(`Minifying script...`);
          contents = luamin.minify(contents.toString());
        }
        fs.writeFileSync(mapLua, contents);
      } catch (err) {
        return console.error(err);
      }


      const verNumber = `${config.buildVersion}`.replace('.', '-');
      const srcMapPath  = `./dist/${config.mapFolder}`.replace('.w3x', '-full.w3x');
      const builtMapPath = `${config.buildMapDir}\\${config.buildName}-${verNumber}.w3x`.replace('%UserProfile%', process.env.USERPROFILE);

      fs.copy(srcMapPath, builtMapPath, (err) => {
        if (err) console.log("err on copy map", err);

        // Now auto place map
        const mpqEditor = `./bin/MPQEditor/x64/MPQEditor.exe`; 

        execFile(mpqEditor, ['add', builtMapPath, mapLua, "war3map.lua"], (err) => {
          if (err) console.log("Error executing mpqeditor auto place lua", err);
          console.log("Complete!");
        })
      });
    });



    break;

  case "run":
    const filename = `${cwd}/dist/${config.mapFolder}`;

    console.log(`Launching map "${filename.replace(/\\/g, "/")}"...`);

    execFile(config.gameExecutable, ["-loadfile", filename, ...config.launchArgs], (err, stdout, stderr) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return console.error(`No such file or directory "${config.gameExecutable}". Make sure gameExecutable is configured properly in config.json.`);
        }
      }
    });

    break;
  case "gen-defs":
    // Create definitions file for generated globals
    const luaFile = `./maps/${config.mapFolder}/war3map.lua`;

    try {
      const contents = fs.readFileSync(luaFile, "utf8");
      const parser = new War3TSTLHelper(contents);
      const result = parser.genTSDefinitions();
      fs.writeFileSync("src/war3map.d.ts", result);
    } catch (err) {
      console.log(err);
      console.log(`There was an error generating the definition file for '${luaFile}'`);
      return;
    }

    break;
}