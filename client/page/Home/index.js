import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmDisplay from "@zos/display";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";

Page(
    BasePage({
        onInit() {
            hmDisplay.pauseDropWristScreenOff({
                duration: 0,
            });
            hmDisplay.pausePalmScreenOff({
                duration: 0,
            });
            hmDisplay.setPageBrightTime({
                brightTime: 2147483000,
            });
        },
        build() {
            const arc = new ProgressArc();
            arc.start();

            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    setTimeout(() => {
                        arc.stop();
                        arc.destroy();
                        const scrollListPageTestData = {
                            title: "Tasks",
                            items: [],
                        };
                        const priorityMap = {
                            urgent_important: "紧急且重要",
                            not_urgent_important: "不紧急但重要",
                            urgent_not_important: "紧急但不重要",
                            not_urgent_not_important: "不紧急且不重要",
                        };
                        const priorityColorMap = {
                            urgent_important: 0xef4444,
                            not_urgent_important: 0xeab308,
                            urgent_not_important: 0x0ea5e9,
                            not_urgent_not_important: 0x6b7280,
                        };

                        scrollListPageTestData.items.push({
                            title: "新建任务",
                            action: () => {
                                hmRouter.push({
                                    url: "page/add-tasks/index",
                                });
                            },
                        });
                        config.tasks.forEach((task) => {
                            if (!task.done) {
                                scrollListPageTestData.items.push({
                                    title: task.name,
                                    description:
                                        priorityMap[task.priority] +
                                            (task.today ? "" : " | 已过期") ||
                                        "未知优先级",
                                    icon: "arrow-right-double-fill.png",
                                    customStyles: {
                                        SETTINGS_BUTTON_SUBTITLE_STYLE: {
                                            color: priorityColorMap[
                                                task.priority
                                            ],
                                        },
                                    },
                                    action: () => {
                                        hmRouter.push({
                                            url: "page/edit-task/index",
                                            params: {
                                                task: task,
                                            },
                                        });
                                    },
                                });
                            }
                        });
                        scrollListPageTestData.items.push({
                            title: "设置",
                            icon: "gear-fill.png",
                            action: () => {
                                hmRouter.push({
                                    url: "page/settings/index",
                                });
                            },
                        });
                        new ScrollListPage(scrollListPageTestData);
                    }, 700);
                }
            });
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    })
);
