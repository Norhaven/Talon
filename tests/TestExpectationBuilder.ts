type Constructor = Function & { prototype: any };

export class TestExpectationBuilder{
    constructor(public readonly actualValue:any){

    }

    toBe(expectedValue:any, because:string){
        const reason = this.formatReasonText(expectedValue, because);
        expect(this.actualValue).withContext(reason).toBe(expectedValue);
    }

    toBeInstanceOf(type:jasmine.Constructor, because:string){
        const reason = this.formatReasonText(type.name, because);
        expect(this.actualValue).withContext(reason).toBeInstanceOf(type);
    }

    asType<T>(type:new()=>T, use:(instance:T)=>void){
        use(this.actualValue);
    }

    toThrowErrorOfType(type:new (...args:any[])=>Error, because:string){
        const reason = this.formatReasonText(type.name, because);
        expect(this.actualValue).withContext(reason).toThrowError(type);
    }

    toBeDefined(because:string){
        const reason = this.formatReasonText("present", because);
        expect(this.actualValue).withContext(reason).toBeDefined();
    }

    private formatReasonText(expectedValue:any, because:string){
        return `Expected value to be ${expectedValue} ${because} but found ${this.actualValue}`;
    }
}

export function expects(actualValue:any){
    return new TestExpectationBuilder(actualValue);
}