///<reference path="A__PropTests/PropTests.ts" />
///<reference path="Dh.ts" />
///<reference path="Element.ts" />




var setContent = (ID: string, html: string) => {
    document.getElementById(ID).innerHTML = html;
};

//interface ISampleJson {
//    field1: string;

//}

function doElxTests() {
    var _ = DOM;

    var el1 = new _.ElX({
        tag: "div",
        textGet: () => "hello world",
    });
    el1.render({ targetDomID: 'Element.Test1.Result' });

    var el2 = _.Div({ text: "I am here" });
    el2.render({ targetDomID: 'Element.Test2.Result' });

    var el3 = 
    _.Div({text: 'Parent Div', kids:
        [_.Div({ text: 'child div' })]
    });

    el3.render({targetDomID: 'Element.Test3.Result' });
}

function doPropTests() {
    var propTest1 = new PropTests.Test1();
    propTest1.Prop1 = "Prop Val 1";
    setContent('PropTests.Test1.Result', propTest1.Prop1);
    
    var propTest2 = new PropTests.Test2({ 
        Prop1: 'iah',
        Prop2: 'Prop Val 2',
    });
    setContent('PropTests.Test2.Result', propTest2.Prop2);

    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2',
    };

    var propTest3 = new PropTests.Test2(json);
  
    
    Dh.ListenForSVChange({
        getter: propTest3.Prop2Getter,
        obj: propTest3,
        callback: newVal =>{
            setContent('PropTests.Test3.Result', newVal);
        },
    });

    propTest3.Prop2 = 'new value';
    
    
}

function doInputTests() {
    var _ = DOM;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2',
    };
    var in1 = _.Input({ value: "Default Text Value", type: 'text' });

    in1.render({ targetDomID: 'Input.Test1.Result' });

    var propTest1 = new PropTests.Test2(json);

    var in2 = _.Input({ valueGet: () => propTest1.Prop2, type: 'text' });

    in2.render({ targetDomID: 'Input.Test2.Result' });

    propTest1.Prop2 = 'new Val';

}

function doTwoWayBindingTests() {
    var _ = DOM;
    var json = {
        Prop1: 'iah',
        Prop2: 'Prop Val 2',
    };
    var propTest1 = new PropTests.Test2(json);
    var d = _.Div({ textGet: () => propTest1.Prop2 });
    //var n = d.notifyTextChange;
    var tw1 = _.Div({
        kids: [
            d,
            _.Input({ valueGet: () => propTest1.Prop2, type: 'text', valueSet: (newVal: string) => { propTest1.Prop2 = newVal; } }),
        ]
    });
    Dh.ListenForSVChange({
        getter: propTest1.Prop2Getter,
        obj: propTest1,
        callback: newVal =>{
            d.notifyTextChange();
        },
    });
    tw1.render({ targetDomID: 'TwoWayBinding.Test1.Result' });
}

interface IChapter {
    name: string;
}

interface IBook {
    title: string;
    chapters: IChapter[];
}

interface ISubject {
    subject: string;
    books: IBook[];
}

function doStaticLists() {
    var _ = DOM;
    var UL = _.UL, LI = _.LI;
    var ul1 = UL({
        kids: [
            LI({ text: 'list item 1',  kids: [
                     UL({collapsed:true, toggleKidsOnParentClick:true, kids:[
                         LI({ text: 'sub 1.1' }),
                         LI({ text: 'sub 1.2' }),
                     ],}),
            ],}),
            LI({ text: 'list item 2' }),
        ],
    });
    ul1.render({ targetDomID: 'Lists.Test1.Result' });
    var json: ISubject = {
        subject: "JavaScript", books : [
            {
                title: "JavaScript Pro", chapters: [
                    { name: 'chapter 1' }
                ]
            }
        ],
    };
    var json: ISubject = {
        subject: "JavaScript", books: [],
    };
    for (var i = 0; i < 10; i++) {
        var book: IBook = {
            title: " book " + i, chapters: [],
        };
        json.books.push(book);
        for (var j = 0; j < 10; j++) {
            var chapter: IChapter = {
                name: 'chapter ' + j,
            };
            book.chapters.push(chapter);
        }
    }
    var chapterToLI:  (chapter : IChapter, i : number) => DOM.ElX = (chapter, i) => {
        return LI({ text: chapter.name });
    };
    var bookToLI: (book: IBook, i: number) => DOM.ElX = (book, i) => {
        var li = LI({
            text: book.title,
            kids: [UL({
                kids: book.chapters.map(chapterToLI)
            })]
        });
        return li;
    };
    //var subjectToLI : (subject : 
    //json.sections.map(
    debugger;
    var ul2 = UL({
        kids: [LI({ text: json.subject, kids: json.books.map(bookToLI) })],
    });
    ul2.render({ targetDomID: 'Lists.Test2.Result' });
}

window.onload = () => {
    doPropTests();
    doElxTests();
    doInputTests();
    doTwoWayBindingTests();
    doStaticLists();
};