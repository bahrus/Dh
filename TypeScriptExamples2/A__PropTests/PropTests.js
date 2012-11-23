var PropTests;
(function (PropTests) {
    var Test1 = (function () {
        function Test1() {
        }
        Object.defineProperty(Test1.prototype, "Prop1", {
            get: function () {
                return this._prop1;
            },
            set: function (val) {
                this._prop1 = val;
            },
            enumerable: true,
            configurable: true
        });
        return Test1;
    })();
    PropTests.Test1 = Test1;    
    var Test2 = (function () {
        function Test2(Prop2Data) {
            this.Prop2Data = Prop2Data;
        }
        Object.defineProperty(Test2.prototype, "Prop2", {
            get: function () {
                return this.Prop2Data.Prop2;
            },
            set: function (val) {
                this.Prop2Data.Prop2 = val;
            },
            enumerable: true,
            configurable: true
        });
        return Test2;
    })();
    PropTests.Test2 = Test2;    
})(PropTests || (PropTests = {}));
//@ sourceMappingURL=PropTests.js.map
