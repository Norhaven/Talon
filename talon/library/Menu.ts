import { Any } from "./Any";

export class Menu{
    static readonly typeName = "~menu";
    static readonly parentTypeName = Any.typeName;

    static readonly describe = "~describe";
    static readonly show = "~show";
    static readonly hide = "~hide";
    static readonly visible = "~visible";
    static readonly main = "~menuMain";
}