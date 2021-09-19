export interface ILog{
    writeFormatted(line:string):void;
    writeStructured(line:string, ...parameters:any[]):void;
    writeStructuredError(error:any, line:string, ...parameters:any[]):void;
    writeReadable(line:string):void;
    writeConsole(line:string):void;
}