/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */


import {mwfUtils} from "../Main.js";
import {EntityManager} from "../Main.js";

/*************
 * example entity
 *************/

export class MyEntity extends EntityManager.Entity {

    constructor() {
        super();
    }

}

export class MediaItem extends EntityManager.Entity {

    constructor(title, src, contentType) {
        super();
        this.title = title;
        this.description = "";
        this.added = Date.now();
        //this.added = (new Date(this.added)).toLocaleDateString();
        this.src = src;
        this.srcType = null;
        this.contentType = contentType;
    }

    get addedDateString() {
        return (new Date(this.added)).toLocaleDateString();
    }

    get mediaType() {
        if (this.contentType) {
            var index = this.contentType.indexOf("/");
            if (index > -1) {
                return this.contentType.substring(0,index);
            }
            else {
                return "UNKNOWN"
            }
        }
        else {
            return "UNKNOWN"
        }
    }

}



