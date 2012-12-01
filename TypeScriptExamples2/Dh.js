var Dh;
(function (Dh) {
    var objectListeners = {
    };
    function getUID() {
        counter++;
        return "Dh_" + counter;
    }
    Dh.getUID = getUID;
    var counter = 0;
    function GUID(obj) {
        if(!obj.DhID) {
            obj.DhID = getUID();
        }
        return obj.DhID;
    }
    Dh.GUID = GUID;
    function ListenForSVChange(listener) {
        var obj = listener.obj;
        var objId = GUID(obj);
        var propName = getStringPropName(listener.getter);
        var lID = objId + "." + propName;
        if(!objectListeners[lID]) {
            objectListeners[lID] = [];
        }
        objectListeners[lID].push(listener.callback);
    }
    Dh.ListenForSVChange = ListenForSVChange;
    function setSV(SVSetter) {
        debugger;

        var obj = SVSetter.obj;
        if(obj.DhID) {
            var propName = getStringPropName(SVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = objectListeners[lID];
            if(listeners) {
                for(var i = 0, n = listeners.length; i < n; i++) {
                    var callback = listeners[i];
                    callback(SVSetter.val);
                }
            }
        }
        SVSetter.setter(SVSetter.obj, SVSetter.val);
    }
    Dh.setSV = setSV;
    var betweenString = (function () {
        function betweenString(val, searchStart) {
            this.val = val;
            this.searchStart = searchStart;
        }
        betweenString.prototype.and = function (searchEnd) {
            var posOfStart = this.val.indexOf(this.searchStart);
            if(posOfStart === -1) {
                return '';
            }
            var posOfEnd = this.val.indexOf(searchEnd, posOfStart);
            if(posOfEnd === -1) {
                return this.val.substring(posOfStart);
            }
            return this.val.substring(posOfStart + this.searchStart.length, posOfEnd);
        };
        return betweenString;
    })();
    Dh.betweenString = betweenString;    
    function getStringPropName(getter) {
        var s = getter.toString();
        var s2 = s.substringBetween('.').and(';');
        return s2;
    }
    Dh.getStringPropName = getStringPropName;
})(Dh || (Dh = {}));
String.prototype.substringBetween = function (searchStart) {
    return new Dh.betweenString(this, searchStart);
};
//@ sourceMappingURL=Dh.js.map