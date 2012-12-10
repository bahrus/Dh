module backwardsComp {
    export function ensureClass(el: HTMLElement, className: string) {
        var classes = getClassList(el);
        var i = classes.indexOf(className);
        if (i > -1) return
        el.className += ' ' + className;
    }

    export function removeClass(el: HTMLElement, className: string) {
        var classes = getClassList(el);
        var i = classes.indexOf(className);
        if (i > -1) {
            classes.splice(i, 1);
        }
        el.className = classes.join(' ');
    }

    function getClassList(el: HTMLElement) : string[] {
        return el.className.split(' ');
    }
}