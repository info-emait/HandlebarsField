import * as sdk from "azure-devops-extension-sdk";
import { log, ready } from "@utils";
import { Control } from "./control.js"; 
import "./control.scss";

//#region [ Start ]

ready(async () => {
    log(`Running application in ${import.meta.env.PROD ? "PROD" : import.meta.env.DEV ? "DEV" : "UNKNOWN"} mode.`);
    
    sdk.init({                        
        loaded: false,
        applyTheme: true
    });
    log("Sdk is initializated.");

    await sdk.ready();
    log("Sdk is ready.");

    // Register control with the call 'sdk.getContributionId()' instead of '#{Extension.Id}#-control' string
    sdk.register(sdk.getContributionId(), () => new Control());
    log("Handlebars field is registered.");
    sdk.notifyLoadSucceeded();
});

//#endregion