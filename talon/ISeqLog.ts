export interface ISeqLog{
    fatal(line:string, ...parameters:any[]):void;
    error(line:string, ...parameters:any[]):void;
    warn(line:string, ...parameters:any[]):void;
    info(line:string, ...parameters:any[]):void;
    debug(line:string, ...parameters:any[]):void;
    verbose(line:string, ...parameters:any[]):void;
}