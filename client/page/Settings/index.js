import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmInteraction from "@zos/interaction";

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

                        const scrollListPage = new ScrollListPage({
                            title: "Settings",
                            items: [
                                {
                                    title: "Daily Notifications",
                                    description: config.settings
                                        .daily_notifications
                                        ? "On"
                                        : "Off",
                                    action() {
                                        console.log("Clicked Daily Notifications");
                                        scrollListPage.updateItemTextByTitle(
                                            "Daily Notifications",
                                            {
                                                description: config.settings
                                                    .daily_notifications
                                                    ? "Off"
                                                    : "On",
                                            }
                                        )
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
                                {
                                    title: "Clear Data",
                                    action() {
                                        console.log("Clicked Clear Data");
                                        AsyncStorage.RemoveFile("config.json", (err, ok) => {
                                            if (!err) {
                                                console.log("config.json removed");
                                                hmRouter.exit();
                                            }
                                        });
                                    },
                                }
                            ],
                        });
                    }, 700);
                }
            });
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    })
);
