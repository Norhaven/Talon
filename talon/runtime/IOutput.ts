export interface IOutput{
    write(line:string, ...parameters:any[]):void;
    writeError(error:any, line:string, ...parameters:any[]):void;
}