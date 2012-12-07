///<reference path="..\Dh.ts" />

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
        constructor (private Prop2Data: ITest2) {
            //this.counter = 0;
        }

        public counter: number = 0;

        //public onBeforeProp2Changed: { (newVal: string): bool; }[]; // array of delegates

        get Prop2(): string {
            this.counter++;
            return this.Prop2Data.Prop2;
        }
        
        private Prop2Setter = (obj: Test2, s: string) => {
            obj.Prop2Data.Prop2 = s;
        };

        public Prop2Getter = (obj: Test2): string => {
            return obj.Prop2;
        };

        set Prop2(val: string) {
            Dh.setSV({ setter: this.Prop2Setter, obj: this, val: val, getter: this.Prop2Getter, });
        }
    }

}
