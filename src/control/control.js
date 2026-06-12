import * as sdk from "azure-devops-extension-sdk";
import { CommonServiceIds } from "azure-devops-extension-api";
import * as devops from "@utils/devops";
import { log } from "@utils";

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

        this.id = null; 
    }

    //#endregion

    
    //#region [ Methods : Public ]

    /**
     * Resizes the view.
     */
    resize () {
        // setTimeout(() => {
        //     const view = doc.querySelector(".xxx");
        //     sdk.resize(Math.max(view.offsetWidth, view.scrollWidth) + 8, Math.max(view.offsetHeight, view.scrollHeight) + 8);
        // }, 1);
    }


    /**
     * Called when a new work item is being loaded in the UI.
     * 
     * @param {object} e Event arguments.
     */
    onLoaded (e) {
        log("Control : onLoaded()", e);
        
        this.id = e.id;
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
        //this.onRefreshed(e);
    };


    /**
     * Called when the work item has been refreshed from the server.
     * 
     * @param {object} e Event arguments.
     */
    onRefreshed (e) {
        log("Control : onRefreshed()", e);
    };    


    /**
     * Sets the field value.
     * 
     * @param {object} value Value to set.
     */
    setValue (value) {
        log("Control : setValue()", value);
        // this.witService.WorkItemFormService.getService()
        //     .then((function(service) {
        //         if ((value === this.value()) && !this.isRequired()) {
        //             this.value(null);
        //             return service.setFieldValue(this.fieldName(), null);
        //         }

        //         this.value(value);
        //         return service.setFieldValue(this.fieldName(), value);
        //     }).bind(this));
    }

    //#endregion
}