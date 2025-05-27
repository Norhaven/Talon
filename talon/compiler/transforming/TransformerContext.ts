import { Type } from "../../common/Type";
import { CompilationError } from "../exceptions/CompilationError";

export class TransformerContext{
    private readonly typesByName:Map<string, Type> = new Map<string, Type>();
    private readonly transformedTypesByName:Set<string> = new Set<string>();

    private dynamicTypeCount = 0;
    private dynamicLabelCount = 0;

    get typeCount(){
        return this.typesByName.size;
    }

    get transformedTypeCount(){
        return this.transformedTypesByName.size;
    }

    get types():Type[]{
        return Array.from(this.typesByName.values());
    }

    get systemTypes():Type[]{
        return this.types.filter(x => x.isSystemType);
    }

    get nonSystemTypes():Type[]{
        return this.types.filter(x => !x.isSystemType);
    }
    
    get orderedTypeHierarchy(){
        const seenTypes = new Set<string>();
        const hierarchyStack:Type[] = [];

        const add = (type:Type) => {
            hierarchyStack.push(type);
            seenTypes.add(type.name);
        };

        for(const type of this.systemTypes){
            add(type);
        }

        const pending:Type[] = [...this.nonSystemTypes];

        while(pending.length > 0){
            const current = pending.shift();

            if (!current){
                continue;
            }

            if (seenTypes.has(current.baseTypeName)){
                add(current);
            } else {
                pending.push(current);
            }
        }
        
        return hierarchyStack;
    }

    createLabel(name?:string){
        return `${name || "dynamicLabel"}_${this.dynamicLabelCount++}`;
    }

    markTypeAsTransformed(type:Type){
        if (!this.typesByName.has(type.name)){
            throw new CompilationError(`Unable to mark unknown type '${type.name}' as transformed, type must be known.`);
        }

        if (!this.transformedTypesByName.has(type.name)){
            this.transformedTypesByName.add(type.name);
        }
    }

    resolveAllTypes(){
        for(const type of this.typesByName.values()){
            this.resolveTypeHierarchyFor(type);
        }
    }

    resolveTypeHierarchyFor(type:Type){
        for(let current:Type|undefined = type; current; current = current.base){
            current.base = this.getType(current.baseTypeName);
        }
    }

    hasType(typeName:string){
        return this.typesByName.has(typeName);
    }

    getType(typeName:string|undefined){
        if (!typeName){
            return undefined;
        }
        
        return this.typesByName.get(typeName);
    }

    addDynamicType(typeName:string, parentTypeName:string){
        const type = this.addType(`${typeName}_${this.dynamicTypeCount}`, parentTypeName);

        this.dynamicTypeCount++;

        return type;
    }

    addType(typeName:string, parentTypeName:string){
        const type = new Type(typeName, parentTypeName);

        this.typesByName.set(typeName, type);

        return type;
    }

    getOrAddType(typeName:string, parentTypeName:string){
        if (this.hasType(typeName)){
            return this.typesByName.get(typeName)!;
        }
        
        return this.addType(typeName, parentTypeName);
    }
}