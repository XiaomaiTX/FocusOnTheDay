import { BaseSideService } from "@zeppos/zml/base-side";
import { gettext } from "i18n";

AppSideService(
    BaseSideService({
        onInit() {
            console.log(gettext("example"));
        },

        onRun() {},

        onDestroy() {},
    })
);
