var DOM;
(function (DOM) {
    var Element = (function () {
        function Element(bindInfo) {
            this.bindInfo = bindInfo;
        }
        Element.prototype.doRender = function (context) {
            var bI = this.bindInfo;
            context.output += '<' + bI.tag;
            context.output += '>';
            if(bI.textGet) {
                context.output += bI.textGet();
            } else {
                context.output += bI.text;
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
        return Element;
    })();
    DOM.Element = Element;    
    var RenderContext = (function () {
        function RenderContext(settings) {
            this.settings = settings;
            this.output = "";
            this.elemStack = [];
        }
        return RenderContext;
    })();
    DOM.RenderContext = RenderContext;    
    function Div(bindInfo) {
        bindInfo.tag = 'div';
        return new Element(bindInfo);
    }
    DOM.Div = Div;
})(DOM || (DOM = {}));
//@ sourceMappingURL=Element.js.map
