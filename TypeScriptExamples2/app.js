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
    var _ = DOM, Input = _.Input, Label = _.LabelForInput;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    };
    var in1 = Input({
        value: "Default Text Value",
        type: 'text'
    });
    in1.render({
        targetDomID: 'Input.Test1.Result'
    });
    var propTest1 = new PropTests.Test2(json);
    var in2 = Input({
        valueGet: function () {
            return propTest1.Prop2;
        },
        type: 'text'
    });
    in2.render({
        targetDomID: 'Input.Test2.Result'
    });
    propTest1.Prop2 = 'new Val';
    var lbl2 = Label({
        text: 'label test',
        forElX: in2
    });
    lbl2.render({
        targetDomID: 'Input.Label2.Result'
    });
}
function doTwoWayBindingTests() {
    var _ = DOM, Div = _.Div, Input = _.Input;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2'
    };
    var propTest1 = new PropTests.Test2(json);
    var d = Div({
        textGet: function () {
            return propTest1.Prop2;
        }
    });
    var tw1 = Div({
        kids: [
            d, 
            Input({
                valueGet: function (ie) {
                    return propTest1.Prop2;
                },
                type: 'text',
                valueSet: function (ie, newVal) {
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
    var jsSubject = DataExamples.GenerateBooks(3, 3);
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
var doDynamicLists_json;
function doDynamicLists() {
    var _ = DOM;
    var UL = _.UL, LI = _.LI;
    var jsSubject = DataExamples.GenerateBooks(10, 10);
    doDynamicLists_json = jsSubject;
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
    Dh.addSelectionChangeListener('global', selectionChangeListener);
    ul1.render({
        targetDomID: 'DynamicLists.Test1.Result'
    });
}
function selectionChangeListener() {
    var _ = DOM;
    var UL = _.UL;
    var selectedChapters = [];
    doDynamicLists_json.books.forEach(function (book) {
        book.chapters.forEach(function (chapter) {
            if(chapter.selected) {
                selectedChapters.push(chapter);
            }
        });
    });
    var ul2 = UL({
        kids: selectedChapters.map(function (ch) {
            return DataExamples.chapterToLI2(ch, 0);
        })
    });
    ul2.render({
        targetDomID: 'DynamicLists.Test1.Result.Detail'
    });
}
window.onload = function () {
    doPropTests();
    doElxTests();
    doInputTests();
    doTwoWayBindingTests();
    doStaticLists();
    doDynamicLists();
};
//@ sourceMappingURL=app.js.map
