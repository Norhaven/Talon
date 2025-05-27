import { Menu } from "../../../library/Menu";
import { Token } from "../../lexing/Token";
import { Expression } from "./Expression";
import { OptionDeclarationExpression } from "./OptionDeclarationExpression";
import { TypeDeclarationExpression } from "./TypeDeclarationExpression";

export class InlineMenuDeclarationExpression extends TypeDeclarationExpression{
    constructor(public readonly menuName:string, public readonly menuText:string, public readonly options:OptionDeclarationExpression[]){
        super(new Token(-1, -1, menuName), new Token(-1, -1, Menu.typeName));
    }
}