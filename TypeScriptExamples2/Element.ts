module DOM {
    export interface IDOMBinder {
        tag?: string;
        //Inner Content - used if textGet is null
        text?: string;
        //Dynamic Inner Content
        textGet?(): string;
        childrenGet? (): Element[];
    }

    export class Element {
        constructor (private bindInfo: IDOMBinder) { }

        public render(context: RenderContext): void {
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            context.output += '>';
            if (bI.textGet) {
                context.output += bI.textGet();
            } else {
                context.output += bI.text;
            }
            if (bI.childrenGet != null) {
                context.elemStack.push(this);
                var children = bI.childrenGet();
                for (var i = 0, n = children.length; i < n; i++) {
                    var child = children[i];
                    child.render(context);
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

}