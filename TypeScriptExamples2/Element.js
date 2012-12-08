var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DOM;
(function (DOM) {
    var ElX = (function () {
        function ElX(bindInfo) {
            this.bindInfo = bindInfo;
            if(!bindInfo.attributes) {
                bindInfo.attributes = {
                };
            }
            var id = bindInfo.id;
            if(!id) {
                id = Dh.getUID();
            }
            this.bindInfo.attributes['ID'] = id;
            Dh.objectLookup[id] = this;
            if(bindInfo.classes) {
                bindInfo.attributes['class'] = bindInfo.classes.join(' ');
                delete bindInfo.classes;
            }
            var styles = bindInfo.styles;
            if(styles) {
                var style = '';
                for(var prop in styles) {
                    style += (prop + ':' + styles[prop] + ';');
                }
                bindInfo.attributes['style'] = style;
                delete bindInfo.styles;
            }
        }
        ElX.prototype.doRender = function (context) {
            context.elements.push(this);
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
            var children = bI.kidsGet ? bI.kidsGet() : bI.kids;
            if(children) {
                if(!this._kidIds) {
                    this._kidIds = [];
                }
                for(var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.parentElement = this;
                    child.doRender(context);
                    this._kidIds.push(child.ID);
                }
            }
            context.output += '</' + bI.tag + '>';
        };
        ElX.prototype.render = function (settings) {
            var renderContext = new RenderContext(settings);
            this.doRender(renderContext);
            var s = renderContext.settings;
            var target;
            if(s.targetDom) {
                target = s.targetDom;
            } else {
                target = document.getElementById(renderContext.settings.targetDomID);
            }
            target.innerHTML = renderContext.output;
            var els = renderContext.elements;
            for(var i = els.length - 1; i > -1; i--) {
                var el = els[i];
                el.notifyAddedToDOM();
            }
        };
        Object.defineProperty(ElX.prototype, "ID", {
            get: function () {
                if(!this._rendered) {
                    return this.bindInfo.attributes['ID'];
                }
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElX.prototype, "parentElement", {
            get: function () {
                if(this._rendered) {
                    var pd = this.parentDOM;
                    return pd ? Dh.objectLookup[pd.id] : null;
                }
                ; ;
                return Dh.objectLookup[this._parentId];
            },
            set: function (elem) {
                this._parentId = elem.ID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElX.prototype, "parentDOM", {
            get: function () {
                var elD = this.el;
                return elD ? elD.parentElement : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElX.prototype, "kidElements", {
            get: function () {
                var returnObj = [];
                if(this._rendered) {
                    var children = this.childrenDOM;
                    for(var child in children) {
                        var childDom = children[child];
                        var childEl = Dh.objectLookup[childDom['id']];
                        if(childEl) {
                            returnObj.push(childEl);
                        }
                    }
                } else {
                    if(this._kidIds) {
                        for(var i = 0, n = this._kidIds.length; i < n; i++) {
                            var kidId = this._kidIds[i];
                            returnObj.push(Dh.objectLookup[kidId]);
                        }
                    }
                }
                return returnObj;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElX.prototype, "childrenDOM", {
            get: function () {
                var elD = this.el;
                return elD ? elD.children : null;
            },
            enumerable: true,
            configurable: true
        });
        ElX.prototype.notifyAddedToDOM = function () {
            this._rendered = true;
            var bI = this.bindInfo;
            this._id = bI.attributes['ID'];
            delete bI.attributes;
            delete this._parentId;
            delete this._kidIds;
        };
        ElX.prototype.notifyTextChange = function () {
            debugger;

            if(!this._rendered) {
                return;
            }
            var bI = this.bindInfo;
            if(!bI.textGet) {
                return;
            }
            var newVal = bI.textGet();
            var h = this.el;
            if(h.innerHTML === newVal) {
                return;
            }
            h.innerHTML = newVal;
        };
        ElX.prototype.notifySPropChange = function (getter) {
            if(!this._rendered) {
                return;
            }
            var bI = this.bindInfo;
            if(!bI.dynamicAttributes) {
                return;
            }
            var propName = Dh.getStringPropName(getter.getter);
            var elemPropGetter = bI.dynamicAttributes[propName];
            if(!elemPropGetter) {
                return;
            }
            var htmlElem = this.el;
            var sVal = elemPropGetter();
            if(htmlElem.attributes[propName] != sVal) {
                htmlElem.attributes[propName] = sVal;
            }
        };
        Object.defineProperty(ElX.prototype, "el", {
            get: function () {
                return document.getElementById(this._id);
            },
            enumerable: true,
            configurable: true
        });
        return ElX;
    })();
    DOM.ElX = ElX;    
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
    })(ElX);
    DOM.InputElement = InputElement;    
    var RenderContext = (function () {
        function RenderContext(settings) {
            this.settings = settings;
            this.output = "";
            this.elements = [];
        }
        return RenderContext;
    })();
    DOM.RenderContext = RenderContext;    
    function Div(bindInfo) {
        bindInfo.tag = 'div';
        return new ElX(bindInfo);
    }
    DOM.Div = Div;
    function Input(bindInfo) {
        return new InputElement(bindInfo);
    }
    DOM.Input = Input;
})(DOM || (DOM = {}));
//@ sourceMappingURL=Element.js.map
