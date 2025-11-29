import { BasePage } from "@zeppos/zml/base-page";

import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as zosRouter from "@zos/router";

import { ProgressArc } from "../components/ui/progress-arc";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { TextTyper } from "../components/ui/text-typer";

Page(
    BasePage({
        onInit() {
            this.arc = new ProgressArc();
            this.arc.start();

            // Debug
            AsyncStorage.WriteJson(
                "config.json",
                {
                    version: "1.0",
                    tasks: [
                        {
                            name: "完成预算报告",
                            today: true,
                            done: false,
                            priority: "urgent_important",
                            notificationTime: "2024-06-01T10:00:00",
                        },
                        {
                            name: "参加例会",
                            today: true,
                            done: false,
                            priority: "urgent_not_important",
                        },
                        {
                            name: "健身",
                            today: true,
                            done: false,
                            priority: "not_urgent_important",
                        },
                        {
                            name: "回复客户邮件",
                            today: false,
                            done: false,
                            priority: "urgent_not_important",
                        },
                        {
                            name: "整理桌面",
                            today: false,
                            done: true,
                            priority: "not_urgent_not_important",
                        },
                    ],
                    settings: {
                        daily_notifications: true,
                        notification_time: "09:00",
                        backend_url: "https://api.example.com",
                        user_profile_description: "",
                        last_open_timestamp: "1689000000000",
                    },
                },
                (err, ok) => {
                    if (ok) console.log("config saved!");
                }
            );
        },
        build() {
            this.arc.stop();
            this.arc.destroy();
            // zosRouter.push({
            //     url: "page/Home/index",
            //     params: {
            //         key: "value",
            //     },
            // });
            this.textWidget = new TextTyper({
                text: {
                    x: px(0),
                    y: px(0),
                    w: px(480),
                    h: px(480),
                    color: 0xffffff,
                    text_size: px(40),
                    text: [
                        "<时间问候>！",
                        "今天感觉怎么样？",
                        "昨天还有<>个任务待完成哦~",
                    ],
                },
                charInterval: 100,
            });
            this.textWidget.start(() => {
                console.log("All texts typed!");
            });
            // zosRouter.push({
            //             url: "page/Settings/index",
            //             params: {
            //                 key: "value",
            //             },
            //         });
        },

        onDestroy() {
            this.arc.stop();
            this.arc.destroy();
        },
    })
);
