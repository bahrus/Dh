module DOM {
    export interface IDOMBinder {

        attributes?: { [name: string]: string; };

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
            this.ID = bindInfo.id;
            if (bindInfo.classes) {
                bindInfo.attributes['class'] = bindInfo.classes.join(' ');
            }

        }

        public doRender(context: RenderContext)  {
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            var attribs = bI.attributes;
            for (var attrib in attribs) {
                context.output += ' ' + attrib + '="' + attribs[attrib] + '"';
            }
            context.output += '>';
            if (bI.textGet) {
                context.output += bI.textGet();
            } else if(bI.text){
                context.output += bI.text;
            }
            var children = bI.kids;
            if (bI.kidsGet) {
                children = bI.kidsGet();
            }
            if (children) {
                context.elemStack.push(this);
                for (var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.doRender(context);
                }
                context.elemStack.pop();
            }
            context.output += '</' + bI.tag + '>';
            if (context.elemStack.length === 0) {
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

        public render(settings: IRenderContextProps){
            var renderContext = new RenderContext(settings);
            this.doRender(renderContext);
        }

        get ID(): string {
            return this.bindInfo.attributes['ID'];
        }

        set ID(val: string) {
            if (val) {
                this.bindInfo.attributes['ID'] = val;
            }
        }
        
    }

    export class InputElement extends Element {
        constructor (private bindInfo: IInputBinder) {
            super(bindInfo);
            bindInfo.tag = "input";
            this.value = bindInfo.value;
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
        public elemStack: Element[];
        constructor (public settings: IRenderContextProps) {
            //this.elemStack.push(settings.rootElement);
            this.output = "";
            this.elemStack = [];
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