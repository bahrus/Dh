var backwardsComp;
(function (backwardsComp) {
    function ensureClass(el, className) {
        var classes = getClassList(el);
        var i = classes.indexOf(className);
        if(i > -1) {
            return;
        }
        el.className += ' ' + className;
    }
    backwardsComp.ensureClass = ensureClass;
    function removeClass(el, className) {
        var classes = getClassList(el);
        var i = classes.indexOf(className);
        if(i > -1) {
            classes.splice(i, 1);
        }
        el.className = classes.join(' ');
    }
    backwardsComp.removeClass = removeClass;
    function getClassList(el) {
        return el.className.split(' ');
    }
})(backwardsComp || (backwardsComp = {}));
//@ sourceMappingURL=ie9.js.map
