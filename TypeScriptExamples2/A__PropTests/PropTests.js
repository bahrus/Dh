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
            this.counter = 0;
            this.Prop2Setter = function (obj, s) {
                obj.Prop2Data.Prop2 = s;
            };
            this.Prop2Getter = function (obj) {
                return obj.Prop2;
            };
            this.BinaryProp1Getter = function (obj) {
                return obj.BinaryProp1;
            };
            this.BinaryProp1Setter = function (obj, b) {
                obj.Prop2Data.BinaryProp1 = b;
            };
        }
        Object.defineProperty(Test2.prototype, "Prop2", {
            get: function () {
                this.counter++;
                return this.Prop2Data.Prop2;
            },
            set: function (val) {
                Dh.setSV({
                    setter: this.Prop2Setter,
                    obj: this,
                    val: val,
                    getter: this.Prop2Getter
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Test2.prototype, "BinaryProp1", {
            get: function () {
                return this.Prop2Data.BinaryProp1;
            },
            set: function (bVal) {
                Dh.setBV({
                    setter: this.BinaryProp1Setter,
                    getter: this.BinaryProp1Getter,
                    obj: this,
                    val: bVal
                });
            },
            enumerable: true,
            configurable: true
        });
        return Test2;
    })();
    PropTests.Test2 = Test2;    
})(PropTests || (PropTests = {}));
//@ sourceMappingURL=PropTests.js.map
