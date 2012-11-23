// Module
module PropTests {

    // Class

    export interface ITest1 {
        Prop1: string;
    }

    export class Test1 implements ITest1 {
        // Constructor
        constructor () {
        }
        

        private _prop1 : string;

        get Prop1(): string {
            return this._prop1;
        }

        set Prop1(val: string) {
            this._prop1 = val;
        }
    }

    export interface ITest2 {
        Prop2: string;
    }

    export class Test2{
        constructor (private Prop2Data: ITest2) {}

        get Prop2(): string {
            return this.Prop2Data.Prop2
        }

        set Prop2(val: string) {
            this.Prop2Data.Prop2 = val;
        }
    }

}
