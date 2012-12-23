var setContent = function (ID, html) {
    document.getElementById(ID).innerHTML = html;
};
function doElxTests() {
    var _ = DOM;
    var el1 = new _.ElX({
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
}
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
    Dh.ListenForSVChange({
        getter: propTest3.Prop2Getter,
        obj: propTest3,
        callback: function (newVal) {
            setContent('PropTests.Test3.Result', newVal);
        }
    });
    propTest3.Prop2 = 'new value';
}
function doInputTests() {
    var _ = DOM;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    };
    var in1 = _.Input({
        value: "Default Text Value",
        type: 'text'
    });
    in1.render({
        targetDomID: 'Input.Test1.Result'
    });
    var propTest1 = new PropTests.Test2(json);
    var in2 = _.Input({
        valueGet: function () {
            return propTest1.Prop2;
        },
        type: 'text'
    });
    in2.render({
        targetDomID: 'Input.Test2.Result'
    });
    propTest1.Prop2 = 'new Val';
}
function doTwoWayBindingTests() {
    var _ = DOM;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    };
    var propTest1 = new PropTests.Test2(json);
    var d = _.Div({
        textGet: function () {
            return propTest1.Prop2;
        }
    });
    var tw1 = _.Div({
        kids: [
            d, 
            _.Input({
                valueGet: function () {
                    return propTest1.Prop2;
                },
                type: 'text',
                valueSet: function (newVal) {
                    propTest1.Prop2 = newVal;
                }
            }), 
            
        ]
    });
    Dh.ListenForSVChange({
        getter: propTest1.Prop2Getter,
        obj: propTest1,
        callback: function (newVal) {
            d.notifyTextChange();
        }
    });
    tw1.render({
        targetDomID: 'TwoWayBinding.Test1.Result'
    });
}
function doStaticLists() {
    var _ = DOM;
    var UL = _.UL, LI = _.LI;
    var ul1 = UL({
        kids: [
            LI({
                text: 'list item 1',
                kids: [
                    UL({
                        collapsed: true,
                        toggleKidsOnParentClick: true,
                        kids: [
                            LI({
                                text: 'sub 1.1'
                            }), 
                            LI({
                                text: 'sub 1.2'
                            }), 
                            
                        ]
                    }), 
                    
                ]
            }), 
            LI({
                text: 'list item 2'
            }), 
            
        ]
    });
    ul1.render({
        targetDomID: 'Lists.Test1.Result'
    });
    var jsSubject = DataExamples.GenerateBooks(1000, 1000);
    var ul2 = UL({
        kids: [
            LI({
                text: jsSubject.subject,
                kids: [
                    UL({
                        toggleKidsOnParentClick: true,
                        collapsed: true,
                        kids: jsSubject.books.map(DataExamples.bookToLI)
                    })
                ]
            })
        ]
    });
    ul2.render({
        targetDomID: 'Lists.Test2.Result'
    });
}
function doDynamicLists() {
    var _ = DOM;
    var UL = _.UL, LI = _.LI;
    var jsSubject = DataExamples.GenerateBooks(10, 10);
    var ul1 = UL({
        kids: [
            LI({
                text: jsSubject.subject,
                kids: [
                    UL({
                        dataContext: jsSubject,
                        toggleKidsOnParentClick: true,
                        collapsed: true,
                        kidsGet: DataExamples.bookGen
                    })
                ]
            })
        ]
    });
    ul1.render({
        targetDomID: 'DynamicLists.Test1.Result'
    });
}
window.onload = function () {
    doDynamicLists();
};
//@ sourceMappingURL=app.js.map
