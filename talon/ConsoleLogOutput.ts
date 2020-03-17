import { ILogOutput } from "./runtime/ILogOutput";

export class ConsoleLogOutput implements ILogOutput{
    debug(line: string): void {
        console.log(`DEBUG: ${line}`);
    }

}