module Dh {
    //export function getPropName( 
    //TOD: make val of generic type

    export interface ISetBoolValue extends IBVGetter {
        setter(obj: any, val: bool): void;
        getter(obj: any): bool;
        obj: any;
        val: bool;
    }

    export interface ISetStringValue extends ISVGetter{
        setter(obj: any, val: string): void;
        getter(obj: any): string;
        obj: any;
        val: string;
    }

    export interface IListenForStringValueChange extends ISVGetter{
        //getter(obj: any): string;
        obj: any;
        callback(newVal: string): void;
    }

    export interface IListenForBoolValueChange extends IBVGetter{
        //getter(obj: any): string;
        obj: any;
        callback(newVal: bool): void;
    }

    export interface IListenForSelectionChange {
        groupName: string;
        callback(): void;
    }

    export interface IListenForTopic {
        topicName: string;
        conditionForNotification?(tEvent: ITopicEvent): bool;
        callback(tEvent: ITopicEvent): void;
        elX?: DOM.ElX;
        elXID?: string;
    }

    export interface ITopicEvent extends IListenForTopic {
        event: Event;
    }

    export interface ISVGetter {
        getter(obj: any): string;
    }

    export interface IBVGetter {
        getter(obj: any): bool;
    }
    
    export var objectLookup: { [name: string]: any; } = {};
    var SVObjectChangeListeners: { [name: string]: { (newVal: string): void; }[]; } = {}; 

    var BVObjectChangeListeners: { [name: string]: { (newVal: bool): void; }[]; } = {};

    //export var windowEventListeners: { [name: string]: { (IListenForTopic): void; }[]; } = {};
    var windowEventListeners: { [name: string]: IListenForTopic[]; } = {};
    var selectionChangeListeners : { [name: string]: { (); void; } []; } = { };
    var selectGroups: { [name: string]: DOM.ElX[]; } = {};

    export function getGlobalStorage() {
        return {
            objectLookup: objectLookup,
            objectListeners: SVObjectChangeListeners,
            windowEventListeners: windowEventListeners,
            selectionChangeListeners: selectionChangeListeners,
            selectGroups: selectGroups,
        };
    }

    export function addSelectionChangeListener(name: string, callBack: () => void ) {
        var listeners = selectionChangeListeners[name];
        if (!listeners) {
            listeners = [];
            selectionChangeListeners[name] = listeners;
        }
        listeners.push(callBack);
    }

    function notifySelectionChange(name: string) {
        var scls = selectionChangeListeners[name];
        if(!scls) return;
        for (var i = 0, n = scls.length; i < n; i++) {
            var scl = scls[i];
            scl();
        }
    }

    

    export function getSelections(groupName: string) {
        return selectGroups[groupName];
    }

    export function clearSelections(groupName: string, notify: bool) {
        var sel = selectGroups[groupName];
        if(!sel) return;
        for (var i = 0, n = sel.length; i < n; i++) {
            var other = sel[i];
            other.selected = false;
        }
        delete selectGroups[groupName];
        if (notify) {
            notifySelectionChange(groupName);
        }
    }

    export function setSelection(groupName: string, elX: DOM.ElX) {
        clearSelections(groupName, false);
        addSelection(groupName, elX, true);
    }

    export function addSelection(groupName: string, elX: DOM.ElX, notify: bool) {
        var sel = selectGroups[groupName];
        if (!sel) {sel = []; selectGroups[groupName] = sel;}
        elX.selected = true;
        sel.push(elX);
        if (notify) notifySelectionChange(groupName);
    }

    export function removeSelection(groupName: string, elX: DOM.ElX, notify: bool) {
        var sel = selectGroups[groupName];
        if(!sel) return;
        debugger;//TODO:  remove
    }

    export function addWindowEventListener(settings: IListenForTopic) {
        var evtName = settings.topicName;
        var listeners = windowEventListeners[evtName];
        if (!listeners) {
            listeners = [];
            windowEventListeners[evtName] = listeners;
        }
        var condition = settings.conditionForNotification;
        
        if (!condition) {
            if (settings.elX) {
                settings.elXID = settings.elX.ID;
                delete settings.elX;
            }
            //condition = ElementMatchesID;
            settings.conditionForNotification = ElementMatchesID
        }
        //var listener = function (ev: Event) {
        //    var el = <HTMLElement>(ev.target);
        //    var topicEvent: ITopicEvent = <ITopicEvent> settings;
        //    topicEvent.event = ev;
        //    if(!condition(topicEvent)) return;
        //    var elX = objectLookup[topicEvent.elXID];
        //    if(!elX) return; //todo:  remove topic handler
        //    topicEvent.elX = elX;
        //    topicEvent.callback(topicEvent);
        //    delete topicEvent.elX;
        //}
        //listeners.push(listener);
        listeners.push(settings);
        window.addEventListener(evtName, windowEventListener);
        //window.addEventListener(settings.topicName, listener);
    }

    function windowEventListener (ev: Event) {
        var evtName = ev.type;
        var topicListenersSettings = windowEventListeners[evtName];
        if(!topicListenersSettings) return;
        for (var i = 0, n = topicListenersSettings.length; i < n; i++) {
            var settings = topicListenersSettings[i];
            var condition = settings.conditionForNotification;
            var el = <HTMLElement>(ev.target);
            var topicEvent: ITopicEvent = <ITopicEvent> settings;
            topicEvent.event = ev;
            if (!condition(topicEvent)) {
                delete topicEvent.event;
                continue;
            }
            var elX = objectLookup[topicEvent.elXID];
            if (!elX) {
                delete topicEvent.event;
                continue; //todo:  remove topic handler
            }
            topicEvent.elX = elX;
            
            topicEvent.callback(topicEvent);
            delete topicEvent.elX;
            delete topicEvent.event;
        }
    }

    function ElementMatchesID(tEvent: ITopicEvent) {
        var el = <HTMLElement>(tEvent.event.target);
        return el.id === tEvent.elXID;
    }
    
    export function getUID() : string {
        counter++;
        return "Dh_" + counter;
    }
    var counter: number = 0;

    export function GUID(obj: any): string {
        var id = obj.DhID;
        if (!id) {
            id = getUID();
            obj.DhID = id;
            objectLookup[id] = obj;
        }
        return id;
    }

    export function cleanUp(d: HTMLElement) {
        var all : any = d.all;
        if (!all) all = d.getElementsByTagName('*');
        
        for (var i = 0, n = all.length; i < n; i++) {
            var elT = <HTMLElement> all[i];
            var elX = objectLookup[elT.id];
            delete elX.kids;
            if (elT.id) delete objectLookup[elT.id];
        }
    }

    export function ListenForSVChange(listener : IListenForStringValueChange){
        var obj = listener.obj;
        var objId = GUID(obj);
        //next two lines repeat in setSV - common func?
        var propName = getStringPropName(listener.getter);
        var lID = objId + "." + propName;
        if (!SVObjectChangeListeners[lID]) SVObjectChangeListeners[lID] = [];
        SVObjectChangeListeners[lID].push(listener.callback);
    }

    export function ListenForBVChange(listener : IListenForBoolValueChange){
        var obj = listener.obj;
        var objId = GUID(obj);
        //next two lines repeat in setSV - common func?
        var propName = getBoolPropName(listener.getter);
        var lID = objId + "." + propName;
        if (!BVObjectChangeListeners[lID]) BVObjectChangeListeners[lID] = [];
        
        BVObjectChangeListeners[lID].push(listener.callback);
    }

    export function setBV(BVSetter: ISetBoolValue) {
        var obj = BVSetter.obj;
        BVSetter.setter(obj, BVSetter.val);
        if(obj.DhID){
            var propName = getBoolPropName(BVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = BVObjectChangeListeners[lID];
            if(listeners){
                for (var i = 0, n = listeners.length; i < n; i++) {
                    var callback = listeners[i];
                    callback(BVSetter.val);
                }
            }
        }
    }

    export function setSV(SVSetter: ISetStringValue) {
        var obj = SVSetter.obj;
        SVSetter.setter(obj, SVSetter.val);
        if(obj.DhID){
            var propName = getStringPropName(SVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = SVObjectChangeListeners[lID];
            if(listeners){
                for (var i = 0, n = listeners.length; i < n; i++) {
                    var callback = listeners[i];
                    callback(SVSetter.val);
                }
            }
        }
        
    }
      
    export class betweenString {
        constructor (private val: string, private searchStart: string) {}

        public and(searchEnd: string): string {
            var posOfStart = this.val.indexOf(this.searchStart);
            if (posOfStart === -1) return '';
            var posOfEnd = this.val.indexOf(searchEnd, posOfStart);
            if (posOfEnd === -1) return this.val.substring(posOfStart);
            return this.val.substring(posOfStart + this.searchStart.length, posOfEnd);
        }
    }

    //export function update(

    export function getStringPropName(getter: { (newVal: any): string; }) : string {
        var s = getter.toString();
        //var s2 = s.substringBetween('.').and(';');
        var s2 = new Dh.betweenString(s, '.').and(';');
        return s2;
    }

    export function getBoolPropName(getter: { (newVal: any): bool; }) : string {
        var s = getter.toString();
        //var s2 = s.substringBetween('.').and(';');
        var s2 = new Dh.betweenString(s, '.').and(';');
        return s2;
    }
}

//interface String {
//    substringBetween(searchStart: string): Dh.betweenString;
//}

//String.prototype.substringBetween = function(searchStart: string): Dh.betweenString{
//    return new Dh.betweenString(this, searchStart);
//}

