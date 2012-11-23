///<reference path="A__PropTests/PropTests.ts" />
///<reference path="Element.ts" />

var setContent = (ID: string, html: string) => {
    document.getElementById(ID).innerHTML = html;
};

window.onload = () => {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();
    var propTest1 = new PropTests.Test1();
    propTest1.Prop1 = "Prop Val 1";
    setContent('PropTests.Test1.Result', propTest1.Prop1);
    
    var propTest2 = new PropTests.Test2({ 
        Prop1: 'iah',
        Prop2: 'Prop Val 2',
    });
    setContent('PropTests.Test2.Result', propTest2.Prop2);

    var el = new DOM.Element({
        Tag: "div",
        TextGet: () => "hello world",
    });
};