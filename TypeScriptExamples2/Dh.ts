module Dh {
    //export function getPropName( 
    //TOD: make val of generic type
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

    export interface ISVGetter {
        getter(obj: any): string;
    }

    export var objectLookup: { [name: string]: any; };

    var objectListeners: { [name: string]: { (newVal: string): void; }[]; } = {}; 

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

    export function ListenForSVChange(listener : IListenForStringValueChange){
        var obj = listener.obj;
        var objId = GUID(obj);
        //next two lines repeat in setSV - common func?
        var propName = getStringPropName(listener.getter);
        var lID = objId + "." + propName;
        if (!objectListeners[lID]) objectListeners[lID] = [];
        objectListeners[lID].push(listener.callback);
    }

    export function setSV(SVSetter: ISetStringValue) {
        var obj = SVSetter.obj;
        if(obj.DhID){
            var propName = getStringPropName(SVSetter.getter);
            var lID = obj.DhID + "." + propName;
            var listeners = objectListeners[lID];
            if(listeners){
                for (var i = 0, n = listeners.length; i < n; i++) {
                    var callback = listeners[i];
                    callback(SVSetter.val);
                }
            }
        }
        SVSetter.setter(SVSetter.obj, SVSetter.val);
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
        var s2 = s.substringBetween('.').and(';');
        return s2;
    }
}

interface String {
    substringBetween(searchStart: string): Dh.betweenString;
}

String.prototype.substringBetween = function(searchStart: string): Dh.betweenString{
    return new Dh.betweenString(this, searchStart);
}

