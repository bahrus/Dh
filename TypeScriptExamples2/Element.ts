///<reference path="InputElement.ts" />
///<reference path="ie9.ts" />
module DOM {
    export interface IDOMBinder {

        attributes?: { [name: string]: string; };
        dynamicAttributes?: { [name: string]: { (el: ElX): string; }; };

        classes?: string[];

        id?: string;

        kids?: ElX[];
        kidsGet? (el: ElX): ElX[];

        styles?: { [name: string]: string; };

        tag?: string;
        //Inner Content - used if textGet is null
        text?: string;
        //Dynamic Inner Content
        textGet?(el: ElX): string;
        //child elements - used if kidsGet is null
        
        toggleKidsOnParentClick?: bool;
        collapsed?: bool;
        dataContext?: any;
        selectSettings?: ISelectBinder;
    }

    

    export interface ISelectBinder {
        //static 
        selected?: bool;
        //dynamic
        selectGet? (elX : ElX): bool;
        selectSet? (elX : ElX, newVal: bool): void;
        group?: string;
        selClassName?: string;
        partialSelClassName?: string;
        unselClassName?: string;
        conformWithParent?: bool;
    }

    function ParentElementToggleClickHandler(tEvent: Dh.ITopicEvent){
        var elX = tEvent.elX;
        //var target = <HTMLElement>tEvent.event.target;
        var kids = elX.kidElements;
        if(!kids) return;
        for (var i = 0, n = kids.length; i < n; i++) {
            var kid = kids[i];
            //var target = kid.el;
            var bI = kid.bindInfo;
            if (bI.collapsed) {
                delete bI.collapsed;
                var target = kid.el;
                kid.innerRender({
                    targetDom: target,
                });
                kid.removeClass('collapsed');
                
            } else if(bI.toggleKidsOnParentClick) {
                bI.collapsed = true;
                kid.ensureClass('collapsed');
                //target.className = 'collapsed';
            }
        }
        
    }

    function SelectElementClickHandler(tEvent: Dh.ITopicEvent) {
        var elX = tEvent.elX;
        var ss = elX.bindInfo.selectSettings;
        //var ssss = ss.selectSet;
        var newVal = !elX.selected;
        var grp = ss.group ? ss.group : 'global';
        if(!ss) return;
        //if(ssss) ssss(newVal);
            
        Dh.clearSelections(grp, false);
        //Dh.selectGroups[grp] = prevSelected;
        //elX.selected = newVal;
        if (newVal) { Dh.setSelection(grp, elX)}
             
    }

    export class ElX {

        constructor (public bindInfo: IDOMBinder) {
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

        public ensureClass(className: string){
            var bI = this.bindInfo;
            if (!this._rendered) {
                //TODO: untested code
                if (!bI.classes) bI.classes = [];
                var c = bI.classes;
                if(c.indexOf(className) != -1) return;
                c.push(className);
                return;
            }
            var el = this.el, cl = el.classList;
            if (cl) { cl.add(className); return; } else { backwardsComp.ensureClass(el, className); }
            
        }

        public hasClass(className: string): bool {
            var bI = this.bindInfo;
            if (!this._rendered) {
                //TODO: untested code
                if (!bI.classes) return false;
                var c = bI.classes;
                var i = c.indexOf(className);
                return (i != -1);
            }
            var cl = this.el.classList;
            return cl.contains(className);
        }

        public removeClass(className: string){
            var bI = this.bindInfo;
            if (!this._rendered) {
                //TODO: untested code
                if (!bI.classes) return;
                var c = bI.classes;
                var i = c.indexOf(className);
                if(i == -1) return;
                c.splice(i, 1);
                return;
            }
            var cl = this.el.classList;
            if (cl) {
                this.el.classList.remove(className);
            } else {
                backwardsComp.removeClass(this.el, className);
            }
        }

        public doRender(context: RenderContext) {
            context.elements.push(this);
            var bI = this.bindInfo;
            if (bI.toggleKidsOnParentClick) {
                Dh.addWindowEventListener({
                    elX: this.parentElement,
                    topicName: 'click',
                    callback: ParentElementToggleClickHandler,
                });
            }
            var ss = bI.selectSettings;
            if (ss) {
                Dh.addWindowEventListener({
                    elX: this,
                    topicName:'click',
                    callback: SelectElementClickHandler,
                });
                if (ss.selected) {
                    this.ensureClass(ss.selClassName ? ss.selClassName : 'selected');
                } else {
                    if (ss.unselClassName) this.ensureClass(ss.unselClassName);
                }
                //if (ss.selClassName) bI.attributes['data-selClassName'] = ss.selClassName;
                //if (ss.unselClassName) bI.attributes['data-unselClassName'] = ss.unselClassName;


            }
            context.output += '<' + bI.tag;
            var attribs = bI.attributes;
            for (var attrib in attribs) {
                context.output += ' ' + attrib + '="' + attribs[attrib] + '"';
            }
            var dynamicAttribs = bI.dynamicAttributes;
            if (dynamicAttribs) {
                for (var dynamicAttrib in dynamicAttribs) {
                    context.output += ' ' + dynamicAttrib + '="' + dynamicAttribs[dynamicAttrib](this) + '"';
                }
            }
            context.output += '>';
            if (bI.textGet) {
                context.output += bI.textGet(this);
            } else if (bI.text) {
                context.output += bI.text;
            }
            if (!bI.collapsed) {
                this.doInnerRender(context);
            }
            context.output += '</' + bI.tag + '>';
        }

        public doInnerRender(context: RenderContext){
            var bI = this.bindInfo;
            
            var children = bI.kidsGet ? bI.kidsGet(this) : bI.kids;
            if (children) {
                if (!this._kidIds) this._kidIds = [];
                for (var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.parentElement = this;
                    child.doRender(context);
                    this._kidIds.push(child.ID);
                }
            }
            this._innerRendered = true;
        }

        public render(settings: IRenderContextProps) {
            var renderContext = new RenderContext(settings);
            var s = renderContext.settings;
            var target: HTMLElement;
            if (s.targetDom) {
                target = s.targetDom;
            } else {
                target = document.getElementById(renderContext.settings.targetDomID);
            }
            Dh.cleanUp(target);
            this.doRender(renderContext);
            
            //clean up
            
            
            target.innerHTML = renderContext.output;
            var els = renderContext.elements;
            for (var i = els.length - 1; i > -1; i--) {
                var el = els[i];
                el.notifyAddedToDOM();
            }
            delete renderContext.elements;
            var s = renderContext.settings;
            delete s.targetDom;
        }

        public innerRender(settings: IRenderContextProps){
            if(this._innerRendered) return;
            var renderContext = new RenderContext(settings);
            
            this.doInnerRender(renderContext);
            var target = this.el;
            
            target.innerHTML = renderContext.output;
            var els = renderContext.elements;
            for (var i = els.length - 1; i > -1; i--) {
                var el = els[i];
                el.notifyAddedToDOM();
            }
            this._innerRendered = true;
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

        public get selected(): bool {
            var ss = this.bindInfo.selectSettings;
            if (!ss) return false;
            var s = ss.selClassName ? ss.selClassName : 'selected';
            return this.hasClass(s);
        }

        public set selected(newVal?: bool) {
            var ss = this.bindInfo.selectSettings;
            if (!ss) return;
            var s = ss.selClassName ? ss.selClassName : 'selected';
            if (newVal === true) {
                this.ensureClass(s);
            } else {
                this.removeClass(s);
            }
            var ssss = ss.selectSet;
            if(ssss) ssss(this, newVal);
        }

        private _rendered: bool;
        private _innerRendered: bool;

        public notifyAddedToDOM() {
            this._rendered = true;
            var bI = this.bindInfo;
            this._id = bI.attributes['ID'];
            delete bI.attributes;
            if (!bI.collapsed) {
                delete this._parentId;
                delete this._kidIds;
            }
            delete this.parentElement;
        }

        public getAttr(name: string): string {
            if (this._rendered) {
                var el = this.el;
                return el.getAttribute(name);
            }
            return this.bindInfo.attributes[name];
        }

        //public notifyInnerAddedToDOM(){
        //    this._innerRendered = true;
        //    delete this._parentId;
        //    delete this._kidIds;
        //}

        public notifyTextChange(/*getter: Dh.ISVGetter*/) {
            if(!this._rendered) return;
            var bI = this.bindInfo;
            if(!bI.textGet) return;
            var newVal = bI.textGet(this);
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
            var sVal = elemPropGetter(this);
            if (htmlElem.attributes[propName] != sVal) {
                htmlElem.attributes[propName] = sVal;
            }
        }
        //Retrieves the associated dom element
        public get el(): HTMLElement {
            return document.getElementById(this._id);
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

    export function Div(bindInfo: IDOMBinder) : ElX {
        bindInfo.tag = 'div';
        return new ElX(bindInfo);
    }

    export function Span(bindInfo: IDOMBinder): ElX {
        bindInfo.tag = 'span';
        return new ElX(bindInfo);
    }

    export function UL(bindInfo:IDOMBinder) : ElX {
        bindInfo.tag = 'ul';
        return new ElX(bindInfo);
    }

    export function LI(bindInfo: IDOMBinder) : ElX {
        bindInfo.tag = 'li';
        return new ElX(bindInfo);
    }
    
    export function Input(bindInfo: IInputBinder): InputElement {
        return new InputElement(bindInfo);
    }

    export function LabelForInput(bindInfo: IInputLabelBinder): InputLabelElement {
        return new InputLabelElement(bindInfo);
    }
}