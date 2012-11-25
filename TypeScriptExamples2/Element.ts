module DOM {
    export interface IDOMBinder {
        tag?: string;
        //Inner Content - used if textGet is null
        text?: string;
        //Dynamic Inner Content
        textGet?(): string;
        //child elements - used if kidsGet is null
        kids?: Element[];
        kidsGet? (): Element[];
    }

    export class Element {
        constructor (private bindInfo: IDOMBinder) { }

        public doRender(context: RenderContext)  {
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            context.output += '>';
            if (bI.textGet) {
                context.output += bI.textGet();
            } else {
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
        
    }

    export interface IRenderContextProps {
        //rootElement: Element;
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

    

}