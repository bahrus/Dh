var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DOM;
(function (DOM) {
    function InputElementChangeHandler(tEvent) {
        var newValue = tEvent.event.target['value'];
        var ie = tEvent.elX;
        if(!newValue || !ie) {
            return;
        }
        ie.bindInfo.valueSet(newValue);
    }
    var InputElement = (function (_super) {
        __extends(InputElement, _super);
        function InputElement(bindInfo) {
                _super.call(this, bindInfo);
            this.bindInfo = bindInfo;
            bindInfo.tag = "input";
            if(bindInfo.valueGet) {
                this.value = bindInfo.valueGet();
            } else {
                this.value = bindInfo.value;
            }
            if(bindInfo.valueSet) {
                Dh.addWindowEventListener({
                    elX: this,
                    callback: InputElementChangeHandler,
                    topicName: 'change'
                });
            }
        }
        Object.defineProperty(InputElement.prototype, "value", {
            get: function () {
                return this.bindInfo.attributes['value'];
            },
            set: function (val) {
                if(val) {
                    this.bindInfo.attributes['value'] = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputElement.prototype, "type", {
            get: function () {
                return this.bindInfo.attributes['type'];
            },
            set: function (val) {
                if(val) {
                    this.bindInfo.attributes['type'] = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        return InputElement;
    })(DOM.ElX);
    DOM.InputElement = InputElement;    
})(DOM || (DOM = {}));
//@ sourceMappingURL=InputElement.js.map
