var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DOM;
(function (DOM) {
    var Element = (function () {
        function Element(bindInfo) {
            this.bindInfo = bindInfo;
            if(!bindInfo.attributes) {
                bindInfo.attributes = {
                };
            }
            this.ID = bindInfo.id;
            if(bindInfo.classes) {
                bindInfo.attributes['class'] = bindInfo.classes.join(' ');
            }
        }
        Element.prototype.doRender = function (context) {
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            var attribs = bI.attributes;
            for(var attrib in attribs) {
                context.output += ' ' + attrib + '="' + attribs[attrib] + '"';
            }
            var dynamicAttribs = bI.dynamicAttributes;
            if(dynamicAttribs) {
                for(var dynamicAttrib in dynamicAttribs) {
                    context.output += ' ' + dynamicAttrib + '="' + dynamicAttribs[dynamicAttrib]() + '"';
                }
            }
            context.output += '>';
            if(bI.textGet) {
                context.output += bI.textGet();
            } else {
                if(bI.text) {
                    context.output += bI.text;
                }
            }
            var children = bI.kids;
            if(bI.kidsGet) {
                children = bI.kidsGet();
            }
            if(children) {
                context.elemStack.push(this);
                for(var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.doRender(context);
                }
                context.elemStack.pop();
            }
            context.output += '</' + bI.tag + '>';
            if(context.elemStack.length === 0) {
                var s = context.settings;
                var target;
                if(s.targetDom) {
                    target = s.targetDom;
                } else {
                    target = document.getElementById(context.settings.targetDomID);
                }
                target.innerHTML = context.output;
            }
        };
        Element.prototype.render = function (settings) {
            var renderContext = new RenderContext(settings);
            this.doRender(renderContext);
        };
        Object.defineProperty(Element.prototype, "ID", {
            get: function () {
                return this.bindInfo.attributes['ID'];
            },
            set: function (val) {
                if(val) {
                    this.bindInfo.attributes['ID'] = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Element.prototype.notifySPropChange = function (getter) {
            var bI = this.bindInfo;
            if(!bI.dynamicAttributes) {
                return;
            }
            var propName = Dh.getStringPropName(getter.getter);
            var elemPropGetter = bI.dynamicAttributes[propName];
            if(!elemPropGetter) {
                return;
            }
            var htmlElem = this.getHTMLElement();
            var sVal = elemPropGetter();
            if(htmlElem.attributes[propName] != sVal) {
                htmlElem.attributes[propName] = sVal;
            }
        };
        Element.prototype.getHTMLElement = function () {
            return null;
        };
        return Element;
    })();
    DOM.Element = Element;    
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
    })(Element);
    DOM.InputElement = InputElement;    
    var RenderContext = (function () {
        function RenderContext(settings) {
            this.settings = settings;
            this.output = "";
            this.elemStack = [];
            this.idStack = [];
        }
        Object.defineProperty(RenderContext.prototype, "rootId", {
            get: function () {
                if(this.settings.targetDomID) {
                    return this.settings.targetDomID;
                }
                if(this.settings.targetDom) {
                    var topMost = this.settings.targetDom;
                    while(topMost.attributes['_g']) {
                        topMost = topMost.parentElement;
                    }
                    if(topMost.id.length == 0) {
                        topMost.id = 'Dh_' + Dh.getUID();
                    }
                    ; ;
                    return topMost.id;
                }
            },
            enumerable: true,
            configurable: true
        });
        return RenderContext;
    })();
    DOM.RenderContext = RenderContext;    
    function Div(bindInfo) {
        bindInfo.tag = 'div';
        return new Element(bindInfo);
    }
    DOM.Div = Div;
    function Input(bindInfo) {
        return new InputElement(bindInfo);
    }
    DOM.Input = Input;
})(DOM || (DOM = {}));
//@ sourceMappingURL=Element.js.map
