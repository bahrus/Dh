var setContent = function (ID, html) {
    document.getElementById(ID).innerHTML = html;
};
function doPropTests() {
    var propTest1 = new PropTests.Test1();
    propTest1.Prop1 = "Prop Val 1";
    setContent('PropTests.Test1.Result', propTest1.Prop1);
    var propTest2 = new PropTests.Test2({
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    });
    setContent('PropTests.Test2.Result', propTest2.Prop2);
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    };
    var propTest3 = new PropTests.Test2(json);
    var t = function () {
        return propTest3.Prop2;
    };
    var ts = t.toString();
    Dh.ListenForSVChange({
        getter: propTest3.Prop2Getter,
        obj: propTest3,
        callback: function (newVal) {
            setContent('PropTests.Test3.Result', newVal);
        }
    });
    propTest3.Prop2 = 'new value';
}
window.onload = function () {
    doPropTests();
    var _ = DOM;
    var el1 = new _.Element({
        tag: "div",
        textGet: function () {
            return "hello world";
        }
    });
    el1.render({
        targetDomID: 'Element.Test1.Result'
    });
    var el2 = _.Div({
        text: "I am here"
    });
    el2.render({
        targetDomID: 'Element.Test2.Result'
    });
    var el3 = _.Div({
        text: 'Parent Div',
        kids: [
            _.Div({
                text: 'child div'
            })
        ]
    });
    el3.render({
        targetDomID: 'Element.Test3.Result'
    });
    var in1 = _.Input({
        value: "Default Text Value",
        type: 'text'
    });
    in1.render({
        targetDomID: 'Input.Test1.Result'
    });
};
//@ sourceMappingURL=app.js.map
