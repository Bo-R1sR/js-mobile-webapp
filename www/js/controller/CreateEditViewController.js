/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";
import application from "../MyApplication.js";

export default class CreateEditViewController extends mwf.ViewController {

    constructor() {
        super();
        this.viewProxy = null;
        this.imageUpload = null;
        this.imageUploadLabel = null;
        this.itemEditFormFRM = null;
        this.srcInput = null;
        this.thumbIMG = null;
        this.thumbVID = null;
        this.imageFile = null;
        console.log("CreateEditViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        var mediaItem = this.args.item; //new entities.MediaItem("m", "https://placeimg.com/300/400/music");

        this.viewProxy = this.bindElement("mediaCreateEditViewTemplate", {item: mediaItem}, this.root).viewProxy;

        this.imageUpload = this.root.querySelector("#imageUpload");
        this.imageUploadLabel = this.root.querySelector("#imageUploadLabel");
        this.itemEditFormFRM = document.forms["itemEditFormFRM"];
        this.srcInput = this.root.querySelector("#srcInput");
        this.thumbIMG = this.root.querySelector("#thumbIMG");
        this.thumbVID = this.root.querySelector("#thumbVID");

        // if localDB, disable ImageUpload possibility
        if(application.currentCRUDScope === "local"){
            this.imageUpload.disabled = true;
            this.imageUpload.style.display = "none";
            this.imageUploadLabel.style.display = "none";
        }

        // check if mediaItem src is empty - assume mediaItem has not been created
        // show empty start page
        if(mediaItem.src === "") {
            this.thumbVID.width = 0;
            //this.thumbVID.height = 0;
            this.thumbIMG.width = 0;
            this.thumbIMG.height = 0;
            this.thumbVID.style.display = "none";
            //this.thumbIMG.style.display = "none";

        // if mediaItem is already created
        } else {
            // if mediaItem contentType is set -> assume Video
            if (mediaItem.contentType) {
                this.thumbIMG.style.display = "none";
                this.thumbIMG.width = 0;
                this.thumbIMG.height = 0;
                this.thumbVID.style.display = "initial";
                //this.thumbVID.height = 150;
                this.thumbVID.width = "calc(100% - 30px)";
            // else assume image
            } else {
                this.thumbVID.style.display = "none";
                this.thumbVID.width = 0;
                //this.thumbVID.height = 0;
                this.thumbIMG.style.display = "initial";
                this.thumbIMG.width = 150;
                this.thumbIMG.height = 150;
            }
        }

        // if scrInput is set or changed, show preview
        // assume always images or existing contentType
        this.srcInput.onblur = (() => {
            console.log("ONBLUR");
            if(this.srcInput.value !== "") {

                if (mediaItem.contentType) {
                    this.thumbIMG.style.display = "none";
                    this.thumbIMG.width = 0;
                    this.thumbIMG.height = 0;
                    this.thumbVID.style.display = "initial";
                   // this.thumbVID.height = 150;
                    this.thumbVID.width = "calc(100% - 30px)";
                    this.thumbVID.src = this.itemEditFormFRM.src.value;
                } else {
                    this.thumbVID.style.display = "none";
                    this.thumbVID.width = 0;
                   // this.thumbVID.height = 0;
                    this.thumbIMG.style.display = "initial";
                    this.thumbIMG.width = 150;
                    this.thumbIMG.height = 150;
                    this.thumbIMG.src = this.itemEditFormFRM.src.value;

                }
            }
        });
        // if image changed with button
        this.imageUpload.onchange = (() => {
            this.imageFile = this.imageUpload.files[0];
            var imageFileURL = URL.createObjectURL(this.imageFile);
            this.itemEditFormFRM.src.value = imageFileURL.substring(5);
            if (this.imageFile.type.match("video")){
                this.thumbVID.style.display = "initial";
                //this.thumbVID.height = 150;
                this.thumbVID.width = "calc(100% - 30px)";
                this.thumbIMG.style.display = "none";
                this.thumbIMG.width = 0;
                this.thumbIMG.height = 0;
                //mediaItem.contentType = imageFile.type;
                this.thumbVID.src = imageFileURL;
            } else if (this.imageFile.type.match("image")) {
                this.thumbIMG.style.display = "initial";
                this.thumbIMG.width = 150;
                this.thumbIMG.height = 150;
                this.thumbVID.style.display = "none";
                //this.thumbVID.height = 0;
                this.thumbVID.width = 0;
                //mediaItem.contentType = null;
                this.thumbIMG.src = imageFileURL;
            }
        });

        this.viewProxy.bindAction("deleteItem", (() => {
            mediaItem.delete().then(() => {
                this.notifyListeners(new mwf.Event("crud", "deleted", "MediaItem", mediaItem._id));
                this.previousView();
            })
        }));

        this.viewProxy.bindAction("submitForm", ((event) => {
            event.original.preventDefault();
           //var itemEditFormFRM = document.forms["itemEditFormFRM"];

            mediaItem.title = this.itemEditFormFRM.title.value;
            mediaItem.description = this.itemEditFormFRM.description.value;
            mediaItem.src = this.itemEditFormFRM.src.value;
/*
            if (this.imageFile.type.match("video")){
                mediaItem.contentType = this.imageFile.type;
            } else if (this.imageFile.type.match("image")) {
                mediaItem.contentType = null;
            }
            
 */

             if (typeof this.imageUpload.files[0] != "undefined") {
                 if (this.imageFile.type.match("video")){
                     mediaItem.contentType = this.imageFile.type;
                 } else if (this.imageFile.type.match("image")) {
                     mediaItem.contentType = null;
                 }


                this.initializeXMLHttpRequest(mediaItem).then(() => {
                    this.previousView();
                });
            }
            else{
                if (mediaItem._id < 0) {
                    mediaItem.create().then(() => {
                        //this.notifyListeners(new mwf.Event("crud", "created", "MediaItem", mediaItem));
                        this.previousView();
                    })
                } else {
                    mediaItem.update().then(() => {
                        //this.notifyListeners(new mwf.Event("crud", "updated", "MediaItem", mediaItem._id));
                        this.previousView();
                    })
                }
            }
        }));

        // call the superclass once creation is done
        super.oncreate();
    }

    async onpause() {
        this.thumbVID.pause();
        super.onpause();
    }

    initializeXMLHttpRequest(mediaItem) {
        return new Promise((resolve, reject) => {
            var formdata = new FormData();
            // setze die Formularfeldwerte

            formdata.append("src", this.imageUpload.files[0]);
            //formdata.append("src", this.srcInput);
            //formdata.append("title", mediaItem.title);
            //formdata.append("description", mediaItem.description);
            var xhr = new XMLHttpRequest();
            // setze einen einfachen Callback, um auf den Response zu reagieren
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE) {
                    console.log("Ready");
                    var response = xhr.responseText;
                    mediaItem.src =  JSON.parse(response).data.src;

                    // Request finished. Do processing here.
                    if (this.status === 200){
                        console.log('successful');

                        if (mediaItem._id < 0) {
                            mediaItem.create().then(() => {
                                //this.notifyListeners(new mwf.Event("crud", "created", "MediaItem", mediaItem));
                                //this.previousView();
                                resolve("SUCCESS");
                            })
                        } else {
                            mediaItem.update().then(() => {
                                //this.notifyListeners(new mwf.Event("crud", "updated", "MediaItem", mediaItem._id));
                                //this.previousView();
                                resolve("SUCCESS");
                            })
                        }
                    }
                    else{
                        console.log('Something failed');
                    }
                }
            }
            xhr.open( "POST", "api/upload" );
            // übermittle die Formulardaten im Request Body
            xhr.send(formdata);
            //this.previousView();
        })
    }
}



