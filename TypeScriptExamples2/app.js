var setContent = function (ID, html) {
    document.getElementById(ID).innerHTML = html;
};
window.onload = function () {
    var propTest1 = new PropTests.Test1();
    propTest1.Prop1 = "Prop Val 1";
    setContent('PropTests.Test1.Result', propTest1.Prop1);
    var propTest2 = new PropTests.Test2({
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    });
    setContent('PropTests.Test2.Result', propTest2.Prop2);
    var el = new DOM.Element({
        tag: "div",
        textGet: function () {
            return "hello world";
        }
    });
    el.render(new DOM.RenderContext({
        targetDomID: 'Element.Test1.Result'
    }));
};
//@ sourceMappingURL=app.js.map
