export class Version{
    constructor(public readonly major:number,
                public readonly minor:number,
                public readonly build:number){
    }

    toString(){
        return `${this.major}.${this.minor}.${this.build}`;
    }
}