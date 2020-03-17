import { IOutput } from "./runtime/IOutput";

export class ConsoleOutput implements IOutput{
    write(line: string): void {
        console.log(line);
    }

}