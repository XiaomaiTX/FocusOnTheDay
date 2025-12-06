import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as zosRouter from "@zos/router";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";

Page(
    BasePage({
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
                            not_urgent_important: 0xEAB308,
                            urgent_not_important: 0x0EA5E9,
                            not_urgent_not_important: 0x6B7280,
                        };

                        scrollListPageTestData.items.push({
                            title: "新建任务",
                            action: () => {
                                zosRouter.push({
                                    url: "page/AddTasks/index",
                                });
                            }
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
                                            color: priorityColorMap[task.priority]
                                        }
                                    }
                                });

                            }
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
