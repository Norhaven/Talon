import { IOutput } from "./runtime/IOutput";

export class ConsoleOutput implements IOutput{
    writeError(error: any, line: string, ...parameters: any[]): void {
        console.error(error, line, parameters);
    }

    write(line: string, ...parameters: any[]): void {
        console.log(line, parameters);
    }
}