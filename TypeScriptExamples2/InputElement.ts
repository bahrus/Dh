///<reference path="Dh.ts" />
///<reference path="Element.ts" />

module DOM {

    export interface IInputBinder extends IDOMBinder{
        type?: string;
        value?: string;
        valueGet? (ie: InputElement): string;
        valueSet? (ie: InputElement, newVal: string): void;
        checkedValueSet? (ie: InputElement, oldVal: string, newVal: string): void;
    }

    export interface IInputLabelBinder extends IDOMBinder {
        forElX: ElX;
    }

    function InputElementChangeHandler(tEvent: Dh.ITopicEvent){
        var newValue = tEvent.event.target['value'];
        var ie = <InputElement> tEvent.elX;
        if(!newValue || !ie) return;
        ie.bindInfo.valueSet(ie, newValue);
    }

    export class InputElement extends ElX {
        constructor (public bindInfo: IInputBinder) {
            super(bindInfo);
            bindInfo.tag = "input";
            if (bindInfo.valueGet) {
                this.value = bindInfo.valueGet(this);
            } else {
                this.value = bindInfo.value;
            }
            if (bindInfo.valueSet) {
                Dh.addWindowEventListener({
                    elX: this,
                    callback: InputElementChangeHandler,
                    //callback: tEvent =>{
                    
                    //},
                    topicName: 'change',
                });
            }
        }

        
        

        get value(): string {
            return this.bindInfo.attributes['value'];
        }

        set value(val: string) {
            if (val) {
                this.bindInfo.attributes['value'] = val;
            }
        }

        get type(): string {
            return this.bindInfo.attributes['type'];
        }

        set type(val: string) {
            if (val) {
                this.bindInfo.attributes['type'] = val;
            }
        }
    }

    export class InputLabelElement extends ElX {
        constructor(public bindInfo: IInputLabelBinder) {
            super(bindInfo);
            bindInfo.tag = 'label';
            this.for = bindInfo.forElX.ID;
            delete bindInfo.forElX;
        }

        //private _forElXID: string;

        get for(): string {
            return this.bindInfo.attributes['for'];
        }

        set for(sVal: string) {
            if (sVal) {
                this.bindInfo.attributes['for'] = sVal;
            }
        }
    }
}

