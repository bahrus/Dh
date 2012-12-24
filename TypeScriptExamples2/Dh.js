var Dh;
(function (Dh) {
    Dh.objectLookup = {
    };
    var objectListeners = {
    };
    var windowEventListeners = {
    };
    var selectionChangeListeners = {
    };
    function addSelectionChangeListener(name, callBack) {
        var listeners = selectionChangeListeners[name];
        if(!listeners) {
            listeners = [];
            selectionChangeListeners[name] = listeners;
        }
        listeners.push(callBack);
    }
    Dh.addSelectionChangeListener = addSelectionChangeListener;
    function notifySelectionChange(name) {
        var scls = selectionChangeListeners[name];
        if(!scls) {
            return;
        }
        for(var i = 0, n = scls.length; i < n; i++) {
            var scl = scls[i];
            scl();
        }
    }
    var selectGroups = {
    };
    function getSelections(groupName) {
        return selectGroups[groupName];
    }
    Dh.getSelections = getSelections;
    function clearSelections(groupName, notify) {
        var sel = selectGroups[groupName];
        if(!sel) {
            return;
        }
        for(var i = 0, n = sel.length; i < n; i++) {
            var other = sel[i];
            other.selected = false;
        }
        delete selectGroups[groupName];
        if(notify) {
            notifySelectionChange(groupName);
        }
    }
    Dh.clearSelections = clearSelections;
    function setSelection(groupName, elX) {
        clearSelections(groupName, false);
        addSelection(groupName, elX, true);
    }
    Dh.setSelection = setSelection;
    function addSelection(groupName, elX, notify) {
        var sel = selectGroups[groupName];
        if(!sel) {
            sel = [];
            selectGroups[groupName] = sel;
        }
        elX.selected = true;
        sel.push(elX);
        if(notify) {
            notifySelectionChange(groupName);
        }
    }
    Dh.addSelection = addSelection;
    function removeSelection(groupName, elX, notify) {
        var sel = selectGroups[groupName];
        if(!sel) {
            return;
        }
        debugger;

    }
    Dh.removeSelection = removeSelection;
    function addWindowEventListener(settings) {
        var evtName = settings.topicName;
        var listeners = windowEventListeners[evtName];
        if(!listeners) {
            listeners = [];
            windowEventListeners[evtName] = listeners;
        }
        var condition = settings.conditionForNotification;
        if(!condition) {
            if(settings.elX) {
                settings.elXID = settings.elX.ID;
                delete settings.elX;
            }
            condition = ElementMatchesID;
        }
        var listener = function (ev) {
            var el = (ev.target);
            var topicEvent = settings;
            topicEvent.event = ev;
            if(!condition(topicEvent)) {
                return;
            }
            var elX = Dh.objectLookup[topicEvent.elXID];
            if(!elX) {
                return;
            }
            topicEvent.elX = elX;
            topicEvent.callback(topicEvent);
            delete topicEvent.elX;
        };
        window.addEventListener(settings.topicName, listener);
    }
    Dh.addWindowEventListener = addWindowEventListener;
    function ElementMatchesID(tEvent) {
        var el = (tEvent.event.target);
        return el.id === tEvent.elXID;
    }
    function getUID() {
        counter++;
        return "Dh_" + counter;
    }
    Dh.getUID = getUID;
    var counter = 0;
    function GUID(obj) {
        var id = obj.DhID;
        if(!id) {
            id = getUID();
            obj.DhID = id;
            Dh.objectLookup[id] = obj;
        }
        return id;
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
        var obj = SVSetter.obj;
        SVSetter.setter(obj, SVSetter.val);
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
        var s2 = new Dh.betweenString(s, '.').and(';');
        return s2;
    }
    Dh.getStringPropName = getStringPropName;
})(Dh || (Dh = {}));
//@ sourceMappingURL=Dh.js.map
