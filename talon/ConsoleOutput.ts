import { IOutput } from "./runtime/IOutput";

export class ConsoleOutput implements IOutput{
    write(line: string, ...parameters: any[]): void {
        console.log(line, parameters);
    }
}