import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmDisplay from "@zos/display";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";
const arc = new ProgressArc();

const state = reactive({
    daily_notifications: "true",
    notification_time: "08:00",
    backend_url: "",
    user_profile_description: "",
    pageData: {},
});

Page(
    BasePage({
        onInit() {
            arc.start();
            hmDisplay.pauseDropWristScreenOff({
                duration: 0,
            });
            hmDisplay.pausePalmScreenOff({
                duration: 0,
            });
            hmDisplay.setPageBrightTime({
                brightTime: 2147483000,
            });

            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    state.daily_notifications = config.settings
                        .daily_notifications
                        ? "true"
                        : "false";
                    state.notification_time =
                        config.settings.notification_time || "08:00";
                    state.backend_url = config.settings.backend_url || "";
                    state.user_profile_description =
                        config.settings.user_profile_description || "";
                }
            });
        },
        build() {
            setTimeout(() => {
                arc.stop();
                arc.destroy();

                state.pageData = computed(() => {
                    return {
                        title: "Settings",
                        items: [
                            {
                                title: "Daily Notifications",
                                description:
                                    state.daily_notifications || "false",
                                action: () => this.changeDailyNotifications(),
                            },
                            {
                                title: "Notification Time",
                                description: state.notification_time,
                            },
                            {
                                title: "Backend URL",
                                description: state.backend_url,
                                action: () => this.editBackendUrl(),
                            },
                            {
                                title: "User Profile Description",
                                description: state.user_profile_description,
                            },
                            {
                                title: "Clear Data",
                                action() {
                                    console.log("Clicked Clear Data");
                                    AsyncStorage.RemoveFile(
                                        "config.json",
                                        (err, ok) => {
                                            if (!err) {
                                                console.log(
                                                    "config.json removed"
                                                );
                                                hmRouter.exit();
                                            }
                                        }
                                    );
                                },
                            },
                        ],
                    };
                });

                const page = new ScrollListPage(state.pageData.value);
                effect(() => {
                    console.log("state changed");
                    page.updateUI(state.pageData.value);
                });
            }, 700);
        },
        changeDailyNotifications() {
            console.log("Toggling daily_notifications");
            state.daily_notifications += "1";
            console.log("New value:", state.daily_notifications);
        },
        editBackendUrl() {
            hmUI.keyboard.clearInput();
            // hmUI.keyboard.inputText(state.taskName);
            hmUI.createKeyboard({
                inputType: hmUI.inputType.CHAR,
                onComplete: (_, result) => {
                    console.log("完成输入:", result.data);
                    state.backend_url = result.data || "无";
                    hmUI.deleteKeyboard();
                },
            });
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    })
);
