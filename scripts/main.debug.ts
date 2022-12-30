import { SourceNode } from "source-map";
import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

const regex = /(\s*).*/gm;

class CustomPrinter extends tstl.LuaPrinter {
    // printStatement(statement: tstl.Statement): SourceNode {
    //     // const debugLineToInsert = ``
    //     const originalResult = super.printStatement(statement);
    //     let app = '';

    //     const source = originalResult.source;
    //     if (source.includes('src/app')) {
    //       const text = originalResult.toString();

    //       if (text.includes('local')) {
    //         const tabs = text.split(regex);
    //         const tabSpacer = (tabs && tabs[1].length > 0) ? tabs[1] : undefined;

    //         // console.log(originalResult.source, originalResult.toString());

    //         if (tabSpacer && tabSpacer.length >= 4) {
    //           // const doInsert = Math.random() < 0.13;
    //           const uuid = createGuid();
    //           app = `${tabSpacer}if (MessageAllPlayers~=nil) then\n${tabSpacer}    MessageAllPlayers("uuid ${uuid}")\n${tabSpacer}end\n`;
    //         }
    //       }
    //     }
    //     // if (originalResult.source)
    //     // console.log("printing statement: "+originalResult);
    //     return this.createSourceNode(statement, [
    //       app,
    //       originalResult,
    //     ]);
    // }
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