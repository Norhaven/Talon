import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeString } from "../library/RuntimeString";
import { Menu } from "../../library/Menu";
import { RuntimeList } from "../library/RuntimeList";

export class LoadInstanceHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadInstance;

    handle(thread:Thread){

        let typeName = <string>thread.currentInstruction?.value!;

        if (!typeName){
            typeName = (<RuntimeString>thread.currentMethod.pop()).value;
        }

        this.logInteraction(thread, typeName);
        
        if (typeName === "~it"){
            const subject = thread.currentPlace!;
            thread.currentMethod.push(subject);
        } else {

            // When the instance was provided in the current method's parameter list,
            // that takes precedence over the global types. This enables cases where
            // an event with a context needs to have an instruction operate on that
            // specific context by type name (e.g. such as moving a single coin) 
            // instead of looking up every single instance from memory and not being
            // sure which one we're talking about.

            if (!this.tryLoadTypeFromParameters(thread, typeName)){
                if (!this.tryLoadTypeFromClosures(thread, typeName)){
                    const instance = Memory.findOrAddInstance(<string>typeName);

                    if (!instance){
                        throw new RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
                    }
        
                    thread.currentMethod.push(instance);
                }
            }            
        }

        return super.handle(thread);
    }

    private tryLoadTypeFromParameters(thread:Thread, typeName:string){
        const parameters = thread.currentMethod.method?.actualParameters;

        if (parameters && parameters.length > 0){
            const instance = parameters.find(x => x.type.name == typeName);

            if (instance?.value){
                thread.currentMethod.push(instance.value);

                return true;
            }
        }

        return false;
    }

    private tryLoadTypeFromClosures(thread:Thread, typeName:string){
        const closures = thread.currentMethod.method?.closureParameters;

        if (closures && closures.some(x => x == typeName)){
            const thisInstance = thread.currentMethod.method?.actualParameters[0].value!; 
            const instance = thisInstance.fields.get(Menu.itClosures);
            
            if (instance?.value instanceof RuntimeList){
                const actualClosures = instance.value;

                for(const closure of actualClosures.items){
                    if (closure.isTypeOf(typeName)){
                        thread.currentMethod.push(closure);

                        return true;
                    }
                }
            }
        }

        return false;
    }
}