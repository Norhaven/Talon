import { ILog } from "./ILog";
import { IOutput } from "./runtime/IOutput";

export class Log implements ILog{
    constructor(private readonly formattedOutput:IOutput,
                private readonly structuredOutput:IOutput,
                private readonly readableOutput:IOutput,
                private readonly consoleOutput:IOutput){

    }

    writeFormatted(line: string): void {
        this.formattedOutput.write(line);
    }

    writeStructured(line: string, ...parameters: any[]): void {
        this.structuredOutput.write(line, ...parameters);
    }

    writeReadable(line: string): void {
        this.readableOutput.write(line);
    }

    writeConsole(line: string): void {
        this.consoleOutput.write(line);
    }
}