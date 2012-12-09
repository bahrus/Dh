///<reference path="Dh.ts" />
///<reference path="Element.ts" />

module DOM {

    function InputElementChangeHandler(tEvent: Dh.ITopicEvent){
        var newValue = tEvent.event.target['value'];
        var ie = <InputElement> tEvent.elX;
        if(!newValue || !ie) return;
        ie.bindInfo.valueSet(newValue);
    }

    export class InputElement extends ElX {
        constructor (public bindInfo: IInputBinder) {
            super(bindInfo);
            bindInfo.tag = "input";
            if (bindInfo.valueGet) {
                this.value = bindInfo.valueGet();
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

}

