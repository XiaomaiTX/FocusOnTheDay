import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";
import { LoadMask } from "../../components/ui/load-mask";
const loadMask = new LoadMask();

Page(
    BasePage({
        build() {
            loadMask.moveIn();
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
                    

                        config.tasks.forEach((task) => {
                            if (!task.done) {
                                scrollListPageTestData.items.push({
                                title: task.name,
                                description:
                                    priorityMap[task.priority] + (task.today ? "" : " | 已过期") ||
                                    "未知优先级",
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
