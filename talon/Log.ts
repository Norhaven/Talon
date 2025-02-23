import { ILog } from "./ILog";
import { IOutput } from "./runtime/IOutput";
import { Stopwatch } from "./Stopwatch";

export class Log implements ILog{
    constructor(private readonly formattedOutput:IOutput,
                private readonly structuredOutput:IOutput,
                private readonly readableOutput:IOutput,
                private readonly consoleOutput:IOutput){

    }

    writeFormatted(line: string): void {
        Stopwatch.measure("Log.Formatted", () => this.formattedOutput.write(line));
    }

    writeStructured(line: string, ...parameters: any[]): void {
        this.structuredOutput.write(line, ...parameters);
    }

    writeStructuredError(error:any, line: string, ...parameters: any[]): void {
        this.structuredOutput.writeError(error, line, ...parameters);
    }

    writeReadable(line: string): void {
        Stopwatch.measure("Log.Readable", () => this.readableOutput.write(line));
    }

    writeConsole(line: string): void {
        Stopwatch.measure("Log.Console", () => this.consoleOutput.write(line));
    }
}