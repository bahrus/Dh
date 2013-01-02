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
        var ie = <InputElement> tEvent.elX;
        var newValue = (ie.type === 'checkbox' ? tEvent.event.target['checked'] : tEvent.event.target['value']);
        
        if( newValue===null || !ie) return;
        ie.bindInfo.valueSet(ie, newValue);
    }

    export class InputElement extends ElX {


        constructor (public bindInfo: IInputBinder) {
            super(bindInfo);
            bindInfo.tag = "input";
            this.type = bindInfo.type ? bindInfo.type : 'text';
            delete bindInfo.type;
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
                    //topicName:  this.type ==='checkbox' ? 'check' : 'change',
                    topicName: 'change',
                });
            }
            
        }

        
        

        get value(): string {
            
            return this.bindInfo.attributes['value'];
        }

        set value(val: string) {
            var bI = this.bindInfo; 
            if (this.type === 'checkbox') {
                if (val) {
                    bI.attributes['checked'] = 'checked';
                } else{
                    var attrib = bI.attributes;
                    delete attrib['checked'];
                }
            } else {
                if (val) {
                    this.bindInfo.attributes['value'] = val;
                }
            }
        }

        get type(): string {
            return this.getAttr('type');
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

