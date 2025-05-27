import { Type } from "../../common/Type";
import { Expression } from "../parsing/expressions/Expression";
import { TransformerContext } from "./TransformerContext";

export interface ITypeTransformer{
    transform(expression:Expression|undefined, type?:Type):void;
}