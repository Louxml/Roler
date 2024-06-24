import { ExtensionType } from "../../extensions/index.js";


export const browserExt = {
    extension: {
        type: ExtensionType.Environment,
        name: "browser",
        priority: -1,
    },

    test: () => true,
    load: async () => {
        await import("./browserAll.js");
    }
}