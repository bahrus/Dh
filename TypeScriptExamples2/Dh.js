var Dh;
(function (Dh) {
    Dh.objectLookup = {
    };
    var SVObjectChangeListeners = {
    };
    var BVObjectChangeListeners = {
    };
    var windowEventListeners = {
    };
    var selectionChangeListeners = {
    };
    var selectGroups = {
    };
    function getGlobalStorage() {
        return {
            objectLookup: Dh.objectLookup,
            objectListeners: SVObjectChangeListeners,
            windowEventListeners: windowEventListeners,
            selectionChangeListeners: selectionChangeListeners,
            selectGroups: selectGroups
        };
    }
    Dh.getGlobalStorage = getGlobalStorage;
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
            settings.conditionForNotification = ElementMatchesID;
        }
        listeners.push(settings);
        window.addEventListener(evtName, windowEventListener);
    }
    Dh.addWindowEventListener = addWindowEventListener;
    function windowEventListener(ev) {
        var evtName = ev.type;
        var topicListenersSettings = windowEventListeners[evtName];
        if(!topicListenersSettings) {
            return;
        }
        for(var i = 0, n = topicListenersSettings.length; i < n; i++) {
            var settings = topicListenersSettings[i];
            var condition = settings.conditionForNotification;
            var el = (ev.target);
            var topicEvent = settings;
            topicEvent.event = ev;
            if(!condition(topicEvent)) {
                delete topicEvent.event;
                continue;
            }
            var elX = Dh.objectLookup[topicEvent.elXID];
            if(!elX) {
                delete topicEvent.event;
                continue;
            }
            topicEvent.elX = elX;
            topicEvent.callback(topicEvent);
            delete topicEvent.elX;
            delete topicEvent.event;
        }
    }
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
    function cleanUp(d) {
        var all = d.all;
        if(!all) {
            all = d.getElementsByTagName('*');
        }
        for(var i = 0, n = all.length; i < n; i++) {
            var elT = all[i];
            var elX = Dh.objectLookup[elT.id];
            delete elX.kids;
            if(elT.id) {
                delete Dh.objectLookup[elT.id];
            }
        }
    }
    Dh.cleanUp = cleanUp;
    function ListenForSVChange(listener) {
        var obj = listener.obj;
        var objId = GUID(obj);
        var propName = getStringPropName(listener.getter);
        var lID = objId + "." + propName;
        if(!SVObjectChangeListeners[lID]) {
            SVObjectChangeListeners[lID] = [];
        }
        SVObjectChangeListeners[lID].push(listener.callback);
    }
    Dh.ListenForSVChange = ListenForSVChange;
    function ListenForBVChange(listener) {
        var obj = listener.obj;
        var objId = GUID(obj);
        var propName = getBoolPropName(listener.getter);
        var lID = objId + "." + propName;
        if(!BVObjectChangeListeners[lID]) {
            BVObjectChangeListeners[lID] = [];
        }
        BVObjectChangeListeners[lID].push(listener.callback);
    }
    Dh.ListenForBVChange = ListenForBVChange;
    function setBV(BVSetter) {
        var obj = BVSetter.obj;
        BVSetter.setter(obj, BVSetter.val);
        if(obj.DhID) {
            var propName = getBoolPropName(BVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = BVObjectChangeListeners[lID];
            if(listeners) {
                for(var i = 0, n = listeners.length; i < n; i++) {
                    var callback = listeners[i];
                    callback(BVSetter.val);
                }
            }
        }
    }
    Dh.setBV = setBV;
    function setSV(SVSetter) {
        var obj = SVSetter.obj;
        SVSetter.setter(obj, SVSetter.val);
        if(obj.DhID) {
            var propName = getStringPropName(SVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = SVObjectChangeListeners[lID];
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
    function getBoolPropName(getter) {
        var s = getter.toString();
        var s2 = new Dh.betweenString(s, '.').and(';');
        return s2;
    }
    Dh.getBoolPropName = getBoolPropName;
})(Dh || (Dh = {}));
//@ sourceMappingURL=Dh.js.map
