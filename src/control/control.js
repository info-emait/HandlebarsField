import * as sdk from "azure-devops-extension-sdk";
import { CommonServiceIds } from "azure-devops-extension-api";
import Handlebars from "handlebars";
import * as devops from "@utils/devops";
import { log, warn } from "@utils";

/**
 * View model for the field control.
 */
export class Control {
    //#region [ Constructor ]

    /**
     * Constructor.
     * 
     * @param {object} args Input arguments.
     */
    constructor (args = {}) {
        log("Control()", this);

        this.node = null;

        this.id = null;
        this.inputs = null;
        this.field = null;
        this.template = null;
        this.helpers = null;
        this.linkTypes = null;

        this.user = null;
        this.wit = null;
        this.value = null;
    }

    //#endregion

    
    //#region [ Methods : Public ]

    /**
     * Sets the field value.
     * 
     * @param {object} value Value to set.
     */
    setValue (value) {
        log("Control : setValue()", value);
    }


    /**
     * Resizes the view.
     */
    resize () {
        setTimeout(() => {
            const view = document.body.firstChild;
            sdk.resize(Math.max(view.offsetWidth, view.scrollWidth) + 8, Math.max(view.offsetHeight, view.scrollHeight) + 8);
        }, 1);
    }

    //#endregion


    //#region [ Event Handlers ]

    /**
     * Called when a new work item is being loaded in the UI.
     * 
     * @param {object} e Event arguments.
     */
    async onLoaded (e) {
        log("Control : onLoaded()", e);
        
        this.node = document.body;
        this.node.innerHTML = "... loading";
        this.resize();

        // Get configuration
        this.id = e.id;
        this.inputs = sdk.getConfiguration().witInputs;
        this.field = this.inputs?.field;
        this.template = this.inputs?.template;
        this.helpers = this.inputs?.helpers || "";
        this.linkTypes = (this.inputs?.linkTypes || "").split(",").filter((lt) => lt.length);

        // Prepare helpers
        if (this.helpers.length) {
            try {
                this.helpers = new Function(`"use strict"; return ({${this.helpers}});`)();
                for (const [name, fn] of Object.entries(this.helpers)) {
                    if (typeof(fn) !== "function") {
                        throw new Error(`Helper '${name}' is not a function.`);
                    }
                    Handlebars.registerHelper(name, fn);
                }
            }
            catch (err) {
                warn("Control : ", err);
            }
        }

        // Load data
        this.user = sdk.getUser();
        this.wit = (await devops.get(`/_apis/wit/workItems`, { "ids": this.id, "$expand": "all" }))?.value[0];
        this.value = this.wit.fields[this.field];

        // Render template
        const template = Handlebars.compile(this.template);
        this.node.innerHTML = template({
            user: this.user,
            wit: this.wit,
            value: this.value
        });

        this.resize();
    }


    /**
     * Called when the active work item is being unloaded in the UI.
     * 
     * @param {object} e Event arguments. 
     */
    onUnloaded (e) {
        log("Control : onUnloaded()", e);
    }


    /**
     * Called when the active work item is modified.
     * 
     * @param {object} e Event arguments. 
     */
    onFieldChanged (e) {
        log("Control : onFieldChanged()", e);
    }


    /**
     * Called after the work item has been saved.
     * 
     * @param {object} e Event arguments. 
     */
    onSaved (e) {
        log("Control : onSaved()", e);
        //this.onRefreshed(e);
    };


    /**
     * Called when the work item is reset to its unmodified state (undo).
     * 
     * @param {object} e Event arguments. 
     */
    onReset (e) {
        log("Control : onReset()", e);
    };


    /**
     * Called when the work item has been refreshed from the server.
     * 
     * @param {object} e Event arguments.
     */
    onRefreshed (e) {
        log("Control : onRefreshed()", e);
    };    

    //#endregion
}