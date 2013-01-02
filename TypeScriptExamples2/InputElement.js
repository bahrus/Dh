var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DOM;
(function (DOM) {
    function InputElementChangeHandler(tEvent) {
        var ie = tEvent.elX;
        var newValue = (ie.type === 'checkbox' ? tEvent.event.target['checked'] : tEvent.event.target['value']);
        if(newValue === null || !ie) {
            return;
        }
        ie.bindInfo.valueSet(ie, newValue);
    }
    var InputElement = (function (_super) {
        __extends(InputElement, _super);
        function InputElement(bindInfo) {
                _super.call(this, bindInfo);
            this.bindInfo = bindInfo;
            bindInfo.tag = "input";
            this.type = bindInfo.type ? bindInfo.type : 'text';
            delete bindInfo.type;
            if(bindInfo.valueGet) {
                this.value = bindInfo.valueGet(this);
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
                var bI = this.bindInfo;
                if(this.type === 'checkbox') {
                    if(val) {
                        bI.attributes['checked'] = 'checked';
                    } else {
                        var attrib = bI.attributes;
                        delete attrib['checked'];
                    }
                } else {
                    if(val) {
                        this.bindInfo.attributes['value'] = val;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputElement.prototype, "type", {
            get: function () {
                return this.getAttr('type');
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
    var InputLabelElement = (function (_super) {
        __extends(InputLabelElement, _super);
        function InputLabelElement(bindInfo) {
                _super.call(this, bindInfo);
            this.bindInfo = bindInfo;
            bindInfo.tag = 'label';
            this.for = bindInfo.forElX.ID;
            delete bindInfo.forElX;
        }
        Object.defineProperty(InputLabelElement.prototype, "for", {
            get: function () {
                return this.bindInfo.attributes['for'];
            },
            set: function (sVal) {
                if(sVal) {
                    this.bindInfo.attributes['for'] = sVal;
                }
            },
            enumerable: true,
            configurable: true
        });
        return InputLabelElement;
    })(DOM.ElX);
    DOM.InputLabelElement = InputLabelElement;    
})(DOM || (DOM = {}));
//@ sourceMappingURL=InputElement.js.map
