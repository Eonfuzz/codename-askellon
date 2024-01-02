import { SourceNode } from "source-map";
import * as ts from "typescript";
import * as tstl from "typescript-to-lua";
import { IProjectConfig, loadJsonFile } from "./utils";

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

const regex = /(\s*).*/gm;

class CustomPrinter extends tstl.LuaPrinter {
  private config: IProjectConfig;

  private blacklist = [
    // 'onForceTakeOrDealDamage',
    // 'addAggressionLog',
    // 'aggressionBetweenTwoPlayers',
    'DisplayTimedTextToPlayer',
  ];

  private blacklistCalc = new RegExp(this.blacklist.join('|'));

  constructor(emitProgram, emitHost, sourceFile) {
    super(emitProgram, emitHost, sourceFile);
    this.config = loadJsonFile("config.json");
  }


    printStatement(statement: tstl.Statement): SourceNode {
      if (this.config.debug == true) {
        // console.log("inserting debug...");
        // const debugLineToInsert = ``
        const originalResult = super.printStatement(statement);
        let app = '';

        const source = originalResult.source;
        // console.log("Source: "+source);
        if (source.includes('.ts')) {
          const text = originalResult.toString();
          const containsBlacklisted = !!text.match(this.blacklistCalc);
          if (text.includes('local') && !containsBlacklisted) {
            const tabs = text.split(regex);
            const tabSpacer = (tabs && tabs[1].length > 0) ? tabs[1] : undefined;

            // console.log(originalResult.source, originalResult.toString());

            if (tabSpacer && tabSpacer.length >= 4) {
              // const doInsert = Math.random() < 0.13;
              const uuid = createGuid();
              app = `${tabSpacer}if (MessageAllPlayers~=nil) then\n${tabSpacer}    MessageAllPlayers("uuid ${uuid}")\n${tabSpacer}end\n`;
            }
          }
          else if (containsBlacklisted) {
            console.log("Blacklisted Func: "+text);
          }
        }
        // if (originalResult.source)
        // console.log("printing statement: "+originalResult);
        return this.createSourceNode(statement, [
          app,
          originalResult,
        ]);
      }
      else {
        return super.printStatement(statement);
      }
    }
}

const plugin: tstl.Plugin = {
    printer: (
      program: ts.Program,
      emitHost: tstl.EmitHost,
      fileName: string,
      file: tstl.File,
    ) => new CustomPrinter(emitHost, program, fileName).print(file),
  };
  
  // ts-prune-ignore-next
  export default plugin;