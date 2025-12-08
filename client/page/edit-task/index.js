import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";
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

Page(
    BasePage({
        onInit(params) {
            this.params = JSON.parse(params);
            console.log("params", JSON.parse(params));
            console.log("this.params", JSON.stringify(this.params));
        },
        build() {
            console.log("this.params", JSON.stringify(this.params));
            console.log("get object key", Object.keys(this.params));
            const arc = new ProgressArc();
            arc.start();
            ScrollListPage.setValue("taskName", this.params.task?.name);
            setTimeout(() => {
                arc.stop();
                arc.destroy();

                const scrollListPageTestData = {
                    title: "Tasks",
                    items: [
                        {
                            title: "任务名称",
                            description:
                                ScrollListPage.getValue("taskName") || "无",
                            value: "taskName",
                            action: () => {
                                hmUI.createKeyboard({
                                    inputType: hmUI.inputType.JSKB,
                                    onComplete: (_, result) => {
                                        console.log("完成输入:", result.data);
                                        ScrollListPage.setValue(
                                            "taskName",
                                            result.data
                                        );
                                        hmUI.deleteKeyboard();
                                    },
                                    onCancel: (_, result) => {
                                        console.log("取消输入");
                                        hmUI.deleteKeyboard();
                                    },
                                    text: this.params.task?.name,
                                });
                            },
                        },

                        {
                            title: "任务优先级",
                            description:
                                priorityMap[this.params.task?.priority] || "无",
                            value: "taskPriority",
                            action: () => {
                            
                            },

                            customStyles: {
                                SETTINGS_BUTTON_DESCRIPTION_STYLE: {
                                    color: priorityColorMap[
                                        this.params.task?.priority
                                    ],
                                },
                            },
                        },
                    ],
                };

                scrollListPageTestData.items.push();
                new ScrollListPage(scrollListPageTestData);
            }, 700);
        },
        onDestroy() {},
    })
);
