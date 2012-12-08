module DOM {
    export interface IDOMBinder {

        attributes?: { [name: string]: string; };
        dynamicAttributes?: { [name: string]: { (): string; }; };

        classes?: string[];

        id?: string;

        kids?: ElX[];
        kidsGet? (): ElX[];

        styles?: { [name: string]: string; };

        tag?: string;
        //Inner Content - used if textGet is null
        text?: string;
        //Dynamic Inner Content
        textGet?(): string;
        //child elements - used if kidsGet is null
        
        
    }

    export interface IInputBinder extends IDOMBinder{
        type?: string;
        value?: string;
        valueGet? (): string;
        valueSet? (newVal: string): void;
        checkedValueSet? (oldVal: string, newVal: string): void;
    }

    export class ElX {

        constructor (private bindInfo: IDOMBinder) {
            if (!bindInfo.attributes) {
                bindInfo.attributes = {};
            }
            var id = bindInfo.id;
            if (!id) {
                id = Dh.getUID();
            }
            this.bindInfo.attributes['ID'] = id;
            
            Dh.objectLookup[id] = this;
            if (bindInfo.classes) {
                bindInfo.attributes['class'] = bindInfo.classes.join(' ');
                delete bindInfo.classes;
            }
            var styles = bindInfo.styles;
            if (styles) {
                var style = '';
                for (var prop in styles) {
                    style += (prop + ':' + styles[prop] + ';');
                }
                bindInfo.attributes['style'] = style;
                delete bindInfo.styles;
            }
            
        }

        public doRender(context: RenderContext) {
            context.elements.push(this);
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            var attribs = bI.attributes;
            for (var attrib in attribs) {
                context.output += ' ' + attrib + '="' + attribs[attrib] + '"';
            }
            var dynamicAttribs = bI.dynamicAttributes;
            if (dynamicAttribs) {
                for (var dynamicAttrib in dynamicAttribs) {
                    context.output += ' ' + dynamicAttrib + '="' + dynamicAttribs[dynamicAttrib]() + '"';
                }
            }
            context.output += '>';
            if (bI.textGet) {
                context.output += bI.textGet();
            } else if (bI.text) {
                context.output += bI.text;
            }
            var children = bI.kidsGet ? bI.kidsGet() : bI.kids;
            if (children) {
                if (!this._kidIds) this._kidIds = [];
                for (var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.parentElement = this;
                    child.doRender(context);
                    this._kidIds.push(child.ID);
                }
            }
            context.output += '</' + bI.tag + '>';
        }

        public render(settings: IRenderContextProps) {
            var renderContext = new RenderContext(settings);
            this.doRender(renderContext);
            var s = renderContext.settings;
            var target: HTMLElement;
            if (s.targetDom) {
                target = s.targetDom;
            } else {
                target = document.getElementById(renderContext.settings.targetDomID);
            }
            target.innerHTML = renderContext.output;
            var els = renderContext.elements;
            for (var i = els.length - 1; i > -1; i--) {
                var el = els[i];
                el.notifyAddedToDOM();
            }
        }

        private _id: string;

        public get ID(): string {
            if(!this._rendered) return this.bindInfo.attributes['ID'];
            return this._id;
        }

        private _parentId: string;

        public get parentElement(): ElX {
            if (this._rendered) {
                var pd = this.parentDOM;
                return pd ? Dh.objectLookup[pd.id] : null;
            };
            return Dh.objectLookup[this._parentId];
        }  

        public set parentElement(elem: ElX) {
            this._parentId = elem.ID;
        }

        

        public get parentDOM(): HTMLElement {
            var elD = this.el;
            return elD ? elD.parentElement : null;
        }

        private _kidIds: string[];

        public get kidElements(): ElX[] {
            var returnObj = [];
            if (this._rendered) {
                var children = this.childrenDOM;
                for (var child in children) {
                    var childDom = children[child];
                    var childEl = Dh.objectLookup[childDom['id']];
                    if (childEl) returnObj.push(childEl);
                }
            } else if(this._kidIds) {
                for (var i = 0, n = this._kidIds.length; i < n; i++) {
                    var kidId = this._kidIds[i];
                    returnObj.push(Dh.objectLookup[kidId]);
                }
            }
            return returnObj;
        }

        public get childrenDOM(): HTMLCollection {
            var elD = this.el;
            return elD ? elD.children : null;
        }

        private _rendered: bool;

        public notifyAddedToDOM() {
            this._rendered = true;
            var bI = this.bindInfo;
            this._id = bI.attributes['ID'];
            delete bI.attributes;
            delete this._parentId;
            delete this._kidIds;
        }

        public notifyTextChange(/*getter: Dh.ISVGetter*/) {
            debugger;
            if(!this._rendered) return;
            var bI = this.bindInfo;
            if(!bI.textGet) return;
            var newVal = bI.textGet();
            var h : HTMLElement = this.el;
            if(h.innerHTML===newVal) return;
            h.innerHTML = newVal;
        }

        public notifySPropChange(getter: Dh.ISVGetter) {
            if(!this._rendered) return;
            var bI = this.bindInfo;
            if (!bI.dynamicAttributes) return;
            var propName = Dh.getStringPropName(getter.getter);
            //might be mixing concepts here
            var elemPropGetter = bI.dynamicAttributes[propName];
            if (!elemPropGetter) return;
            var htmlElem = this.el;
            var sVal = elemPropGetter();
            if (htmlElem.attributes[propName] != sVal) {
                htmlElem.attributes[propName] = sVal;
            }
        }
        //Retrieves the associated dom element
        public get el(): HTMLElement {
            return document.getElementById(this._id);
        }
    }

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

    export interface IRenderContextProps {
        targetDomID?: string;
        targetDom?: HTMLElement;
    }

    export class RenderContext {
        public output: string;
        public elements: ElX[];
        //public idStack: number[];
        
        constructor (public settings: IRenderContextProps) {
            //this.elemStack.push(settings.rootElement);
            this.output = "";
            this.elements = [];
            //this.idStack = []; 
        }

        
    }

    export function Div(bindInfo : IDOMBinder) : ElX {
        bindInfo.tag = 'div';
        return new ElX(bindInfo);
    }

    
    export function Input(bindInfo: IInputBinder): InputElement {
        return new InputElement(bindInfo);
    }
}