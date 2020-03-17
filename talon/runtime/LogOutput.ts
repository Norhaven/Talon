import { IOutput } from "./IOutput";

export class LogOutput implements IOutput{
    write(line: string): void {
        console.log(`LOG: ${line}`);
    }
}