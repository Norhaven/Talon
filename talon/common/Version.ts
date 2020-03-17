export class Version{
    constructor(public readonly major:number,
                public readonly minor:number,
                public readonly patch:number){
    }

    toString(){
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}