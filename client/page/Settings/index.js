import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as zosInteraction from "@zos/interaction";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";
const arc = new ProgressArc();

Page(
    BasePage({
        onInit() {
            arc.start();
        },
        build() {
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    setTimeout(() => {
                        arc.stop();
                        arc.destroy();
                        const settingsPageData = {
                            title: "Settings",
                            items: [
                                {
                                    title: "Daily Notifications",
                                    description: config.settings
                                        .daily_notifications
                                        ? "On"
                                        : "Off",
                                    action() {
                                        const dialog = createModal({
                                            content: "hello world",
                                            autoHide: false,
                                            onClick: (keyObj) => {
                                                const { type } = keyObj;
                                                if (type === MODAL_CONFIRM) {
                                                    console.log("confirm");
                                                } else {
                                                    dialog.show(false);
                                                }
                                            },
                                        });

                                        dialog.show(true);
                                    },
                                },
                                {
                                    title: "Notification Time",
                                    description:
                                        config.settings.notification_time,
                                },
                                {
                                    title: "Backend URL",
                                    description: config.settings.backend_url,
                                },
                                {
                                    title: "user_profile_description",
                                    description:
                                        config.settings
                                            .user_profile_description,
                                },
                            ],
                        };

                        new ScrollListPage(settingsPageData);
                    }, 700);
                }
            });
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    })
);
