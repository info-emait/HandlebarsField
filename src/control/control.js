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
     * Add a custom control to the work item form
     * https://learn.microsoft.com/en-us/azure/devops/extend/develop/custom-control?view=azure-devops
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
        this.loadRelatedWits = null;

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

        // Handle events
        this.node.addEventListener("click", this.onClick);

        // Get configuration
        this.id = e.id;
        this.inputs = sdk.getConfiguration().witInputs;
        this.field = this.inputs?.field;
        this.template = this.inputs?.template;
        this.helpers = this.inputs?.helpers || "";
        this.loadRelatedWits = (this.inputs?.loadRelatedWits === "true") ? true : false;

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

        this._loadRelations();
        this._render();
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
        this.value = e.changedFields[this.field];
        this.onRefreshed({ id: e.id });
    }


    /**
     * Called after the work item has been saved.
     * 
     * @param {object} e Event arguments. 
     */
    onSaved (e) {
        log("Control : onSaved()", e);
        this.onRefreshed({ id: e.id });
    }


    /**
     * Called when the work item is reset to its unmodified state (undo).
     * 
     * @param {object} e Event arguments. 
     */
    onReset (e) {
        log("Control : onReset()", e);
    }


    /**
     * Called when the work item has been refreshed from the server.
     * 
     * @param {object} e Event arguments.
     */
    async onRefreshed (e) {
        log("Control : onRefreshed()", e);

        // Load data
        this.wit = (await devops.get(`/_apis/wit/workItems`, { "ids": e.id, "$expand": "all" }))?.value[0];

        this._loadRelations();
        this._render();
    }


    /**
     * Called when the user clicks any hyperlink.
     * 
     * @param {object} e Event arguments.
     */
    async onClick (e) {
        let href = e.target.getAttribute("href");
        let target = e.target.getAttribute("target");
        
        if (!href) {
            const parent = e.target.closest("[href]");
            if (parent) {
                href = parent.getAttribute("href");
                target = parent.getAttribute("target");
            }
        }

        if (href) {
            e.preventDefault();
            const host = await sdk.getService(CommonServiceIds.HostNavigationService);
            if (target === "_blank") {
                host.openNewWindow(href);
                return;
            }

            host.navigate(href);
        }

        return true;
    }

    //#endregion


    //#region [ Methods : Private ]

    /**
     * Loads related work items.
     */
    async _loadRelations () {
        if (!this.loadRelatedWits || !this.wit) {
            return;
        }

        const relatedIds = this.wit.relations
            .map((r) => parseInt(r.url.split("/_apis/wit/workItems/")[1]))
            .filter((i) => !isNaN(i));
        const relatedWits = (await devops.get(`/_apis/wit/workItems`, { "ids": relatedIds.join(","), "$expand": "all" }))?.value || [];
        this.wit.relations.forEach((r) => {
            const rw = relatedWits.find((rr) => rr.url === r.url);
            if (rw) {
                r.wit = rw;
            }
        });
    }


    /**
     * Renders the field UI.
     */
    _render () {
        const template = Handlebars.compile(this.template);
        this.node.innerHTML = template({
            user: this.user,
            wit: this.wit,
            value: this.value
        });

        this.resize();
    }

    //#endregion
}