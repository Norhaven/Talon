var structuredLog = require('structured-log');
var seqSink = require('structured-log-seq-sink');

import { IOutput } from "./runtime/IOutput";

export class LogOutput implements IOutput{
    private readonly logger:any;
    private canWrite = true;

    get enabled(){
        return this.canWrite;
    }

    set enabled(value:boolean){
        this.canWrite = value;
    }

    constructor(){
        this.logger = structuredLog.configure()
            .writeTo(seqSink({ 
                url: "http://localhost:5341"
            }))
            .create();
    }

    write(line: string, ...parameters:any[]): void {
        if (!this.canWrite){
            return;
        }

        try{        
            this.logger.debug(line, ...parameters);
        } catch (ex){
            console.error("Unable to log to Seq server, will stop trying now.", ex);
            this.canWrite = false;
        }
    }
}