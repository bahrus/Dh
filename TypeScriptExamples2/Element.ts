module DOM {
    export interface IDOMBinder {
        Tag?: string;
        Text?: string;
        TextGet?(): string;
    }

    export class Element {
        constructor (private bindInfo: IDOMBinder) { }
    }
}