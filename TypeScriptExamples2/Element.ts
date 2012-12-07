module DOM {
    export interface IDOMBinder {

        attributes?: { [name: string]: string; };
        dynamicAttributes?: { [name: string]: { (): string; }; };

        classes?: string[];

        id?: string;

        kids?: Element[];
        kidsGet? (): Element[];

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
    }

    export class Element {

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
            if (context.elements.length === 0) {
                var s = context.settings;
                var target: HTMLElement;
                if (s.targetDom) {
                    target = s.targetDom;
                } else {
                    target = document.getElementById(context.settings.targetDomID);
                }
                target.innerHTML = context.output;
            }
        }

        public render(settings: IRenderContextProps) {
            var renderContext = new RenderContext(settings);
            this.doRender(renderContext);
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

        public get parentElement(): Element {
            if (this._rendered) {
                var pd = this.parentDOM;
                return pd ? Dh.objectLookup[pd.id] : null;
            };
            return Dh.objectLookup[this._parentId];
        }  

        public set parentElement(elem: Element) {
            this._parentId = elem.ID;
        }

        

        public get parentDOM(): HTMLElement {
            var elD = this.el;
            return elD ? elD.parentElement : null;
        }

        private _kidIds: string[];

        public get kidElements(): Element[] {
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
                    returnObj.push(Dh.objectLookup[kidId];
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

    export class InputElement extends Element {
        constructor (private bindInfo: IInputBinder) {
            super(bindInfo);
            bindInfo.tag = "input";
            if (bindInfo.valueGet) {
                this.value = bindInfo.valueGet();
            } else {
                this.value = bindInfo.value;
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
        public elements: Element[];
        //public idStack: number[];
        
        constructor (public settings: IRenderContextProps) {
            //this.elemStack.push(settings.rootElement);
            this.output = "";
            this.elements = [];
            //this.idStack = []; 
        }

        
    }

    export function Div(bindInfo : IDOMBinder) : Element {
        bindInfo.tag = 'div';
        return new Element(bindInfo);
    }

    
    export function Input(bindInfo: IInputBinder): InputElement {
        return new InputElement(bindInfo);
    }
}