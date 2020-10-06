/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";
//import {GenericCRUDImplLocal} from "../Main.js";
import application from "../MyApplication.js";


export default class ListviewViewController extends mwf.ViewController {

    constructor() {
        super();
        this.resetDatabaseElement = null;
        this.currentCRUDscope = null;

        console.log("ListviewViewController()");

        /*
        this.items = [
            new entities.MediaItem("m1", "https://placeimg.com/100/100/city"),
            new entities.MediaItem("m2", "https://placeimg.com/200/150/music"),
            new entities.MediaItem("m3", "https://placeimg.com/150/200/culture")
        ];
        */

        this.addNewMediaItem = null;

        //this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");

    }

    /*
     * for any view: initialise the view
     */
    deleteItem(item) {
        //this.crudops.delete(item._id).then(() => {
        //    this.removeFromListview(item._id);
        //});
        item.delete().then(() => {
            //this.removeFromListview(item._id);
        });
    }

    confirmDeleteItem(item) {
        this.showDialog("mediaItemDeleteDialog", {
            item: item,
            actionBindings: {
                abortDelete: ((event) => {
                    this.hideDialog();
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });



    }

    editItem(item) {
        /*
        item.title = (item.title + item.title);
        //this.crudops.update(item._id,item).then(() => {
        //    this.updateInListview(item._id,item);
        //});
        item.update().then(() => {
            this.updateInListview(item._id,item);
        });
        */
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        //this.updateInListview(item._id,item);
                    });
                    this.hideDialog();
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });
    }

    async oncreate() {



        // TODO: do databinding, set listeners, initialise the view

        this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"),((event) => {
            this.removeFromListview(event.data);
        }));

        this.addListener(new mwf.EventMatcher("crud","created","MediaItem"),((event) => {
            this.addToListview(event.data);
        }));

        this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"),((event) => {
            this.updateInListview(event.data._id,event.data);
        }));

        this.currentCRUDscope = this.root.querySelector("#currentCRUDscope");
        this.currentCRUDscope.innerHTML = "'" + application.currentCRUDScope + "'";


        this.resetDatabaseElement = this.root.querySelector("#resetDatabase");
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.switchCRUD = this.root.querySelector("#switchCRUD");




        this.addNewMediaItemElement.onclick = (() => {
            //this.crudops.create(new entities.MediaItem("m","https://placeimg.com/100/100/city")).then((created) => {
            //    this.addToListview(created);
            // });
            //this.addToListview(new entities.MediaItem("m new","https://placeimg.com/100/100/city"));

            var newItem = new entities.MediaItem("", "");
            this.nextView("mediaEditview", {item: newItem});

            //this.createNewItem();
        });

        this.resetDatabaseElement.onclick = (() => {
           if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
               indexedDB.deleteDatabase("mwftutdb");
           }
        });

        this.switchCRUD.onclick = (() => {
            if (this.currentCRUDscope.innerHTML === "'" + "local" + "'") {
                console.log("switching CRUD to remote");
                application.switchCRUD("remote");
            }
            if (this.currentCRUDscope.innerHTML === "'" + "remote" + "'") {
                console.log("switching CRUD to local");
                application.switchCRUD("local");
            }

            this.currentCRUDscope.innerHTML = "'" + application.currentCRUDScope + "'";

            entities.MediaItem.readAll().then((items) => {
                this.initialiseListview(items);
            });

        });

        //this.crudops.readAll().then((items) => {
        //    this.initialiseListview(items);
        //});

        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
        });

        //this.initialiseListview(this.items);

        // call the superclass once creation is done
        super.oncreate();

    }

    createNewItem() {
        var newItem = new entities.MediaItem("", "https://placeimg.com/100/100/city");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        //this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
        /*
        newItem.create().then(() => {
            this.addToListview(newItem);
        });
        */
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    /*
    bindListItemView(viewid, itemview, item) {
        // TODO: implement how attributes of item shall be displayed in itemview
        itemview.root.getElementsByTagName("img")[0].src = item.src;
        itemview.root.getElementsByTagName("h2")[0].textContent = item.title+item._id;
        itemview.root.getElementsByTagName("h3")[0].textContent = item.added;
    }
    */

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */

    /*
    onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
        //alert("Element " + listitem.title + listitem._id + " wurde ausgewählt!");
        this.nextView("mediaReadview", {item:listitem});
    }
    */

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
        super.onListItemMenuItemSelected(option, listitem,listview);
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialog, item) {
        // call the supertype function
        super.bindDialog(dialogid, dialog, item);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */

    /*
    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
        if(subviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
    }
    */

}

