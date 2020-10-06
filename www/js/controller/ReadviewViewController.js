/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class ReadviewViewController extends mwf.ViewController {

    constructor() {
        super();
        this.viewProxy = null;
        this.readViewVID = null;
        console.log("ReadviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
		
		this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"),((event) => {this.markAsObsolete();}),true);
		
        // TODO: do databinding, set listeners, initialise the view
        this.readViewVID = this.root.querySelector("#readViewVID");
        var mediaItem = this.args.item; //new entities.MediaItem("m", "https://placeimg.com/300/400/music");

        /*
        this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"),((event) => {
           this.viewProxy.update({item: this.args.item});

        }));
         */

        this.viewProxy = this.bindElement("mediaReadviewTemplate", {item:mediaItem}, this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem", (() => {
            mediaItem.delete().then(() => {
                this.notifyListeners(new mwf.Event("crud","deleted","MediaItem",mediaItem._id));
                this.previousView();
            })
        }));

        this.viewProxy.bindAction("editItem", (() => {
            this.nextView("mediaEditview", {item:mediaItem});
        }));

        // call the superclass once creation is done
        super.oncreate();
    }

     /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        this.viewProxy.update({item: this.args.item});
        //this.previousView(false);
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

    async onpause() {

        if (this.readViewVID){
            this.readViewVID.pause();
        }
        super.onpause();
    }

}

