import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmDisplay from "@zos/display";
import * as hmInteraction from "@zos/interaction";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";

import { priorityOrder, priorityMap, priorityColorMap } from "../../enums/task";

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
            hmInteraction.onGesture({
                callback: (event) => {
                    if (event === hmInteraction.GESTURE_RIGHT) {
                        console.log("right");
                        hmRouter.exit();
                    }
                    return true;
                },
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

                        scrollListPageTestData.items.push({
                            title: "新建任务",
                            action: () => {
                                hmRouter.push({
                                    url: "page/add-tasks/index",
                                });
                            },
                            customStyles: {
                                SETTINGS_BUTTON_STYLE: {
                                    color: 0xe5e5e5,
                                },
                                SETTINGS_BUTTON_TITLE_STYLE: {
                                    color: 0x000000,
                                    align_h: hmUI.align.CENTER_H,
                                },
                            },
                        });

                        this.sortTasks(config.tasks).forEach((task) => {
                            scrollListPageTestData.items.push({
                                title: task.name,
                                description:
                                    priorityMap[task.priority] +
                                        (task.today ? "" : " | 已过期") ||
                                    "未知优先级",
                                icon: "arrow-right-double-fill.png",
                                customStyles: {
                                    SETTINGS_BUTTON_SUBTITLE_STYLE: {
                                        color: priorityColorMap[task.priority],
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
        sortTasks(tasksList) {
            return tasksList.sort((a, b) => {
                const aIndex = priorityOrder.indexOf(a.priority);
                const bIndex = priorityOrder.indexOf(b.priority);
                return aIndex - bIndex;
            });
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    }),
);
