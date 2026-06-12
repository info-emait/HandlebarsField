import * as sdk from "azure-devops-extension-sdk";
import { log, ready } from "@utils";
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

    sdk.register("handlebarsfield-control", () => {});
    log("Handlebars field is registered.");
    sdk.notifyLoadSucceeded();
});

//#endregion