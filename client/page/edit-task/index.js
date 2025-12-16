import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { reactive, effect } from "@x1a0ma17x/zeppos-reactive";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";
import { computed } from "@x1a0ma17x/zeppos-reactive";

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

const state = reactive({
    _taskName: "",
    taskName: "",
    taskPriority: "无",
    pageData: {},
});

Page(
    BasePage({
        onInit(params) {
            params = JSON.parse(params);
            state._taskName = params.task?.name || "无";
            state.taskName = params.task?.name || "无";
            state.taskPriorityName = priorityMap[params.task?.priority] || "无";
            state.taskPriorityColor =
                priorityColorMap[params.task?.priority] || 0xffffff;
        },
        build() {
            const arc = new ProgressArc();
            arc.start();

            setTimeout(() => {
                arc.stop();
                arc.destroy();

                state.pageData = computed(() => {
                    return {
                        title: "Tasks",
                        items: [
                            {
                                title: "完成任务",
                                action: () => {
                                    AsyncStorage.ReadJson(
                                        "config.json",
                                        (err, config) => {
                                            if (!err) {
                                                for (let i = 0; i < config.tasks.length; i++) {
                                                    if (
                                                        config.tasks[i].name ===
                                                        state._taskName
                                                    ) {
                                                        config.tasks[i].done = true;
                                                        break;
                                                    }
                                                }
                                                AsyncStorage.WriteJson(
                                                    "config.json",
                                                    config,
                                                    (err, ok) => {
                                                        if (!err) {
                                                            hmRouter.back();
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            },
                            {
                                title: "任务名称",
                                description: state.taskName || "无",
                                action: () => {
                                    hmUI.keyboard.clearInput();
                                    // hmUI.keyboard.inputText(state.taskName);
                                    hmUI.createKeyboard({
                                        inputType: hmUI.inputType.CHAR,
                                        onComplete: (_, result) => {
                                            console.log(
                                                "完成输入:",
                                                result.data
                                            );
                                            state.taskName =
                                                result.data || "无";
                                            hmUI.deleteKeyboard();
                                        },
                                    });
                                },
                            },

                            {
                                title: "任务优先级",
                                description: state.taskPriorityName || "无",
                                action: () => {},

                                customStyles: {
                                    SETTINGS_BUTTON_DESCRIPTION_STYLE: {
                                        color:
                                            state.taskPriorityColor || 0xffffff,
                                    },
                                },
                            },
                            {
                                title: "删除任务",
                                action: () => {
                                    AsyncStorage.ReadJson(
                                        "config.json",
                                        (err, config) => {
                                            if (!err) {
                                                config.tasks =
                                                    config.tasks.filter(
                                                        (task) =>
                                                            task.name !==
                                                            state._taskName
                                                    );
                                                AsyncStorage.WriteJson(
                                                    "config.json",
                                                    config,
                                                    (err, ok) => {
                                                        if (!err) {
                                                            hmRouter.back();
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                },
                            },
                            {
                                title: "完成并保存",
                                action: () => {
                                    AsyncStorage.ReadJson(
                                        "config.json",
                                        (err, config) => {
                                            if (!err) {
                                                for (let i = 0; i < config.tasks.length; i++) {
                                                    if (
                                                        config.tasks[i].name ===
                                                        state._taskName
                                                    ) {
                                                        config.tasks[i].name =
                                                            state.taskName;
                                                        config.tasks[i].priority =
                                                            Object.keys(
                                                                priorityMap
                                                            ).find(
                                                                (key) =>
                                                                    priorityMap[
                                                                        key
                                                                    ] ===
                                                                    state.taskPriorityName
                                                            ) || null;
                                                        break;
                                                    }
                                                }
                                                AsyncStorage.WriteJson(
                                                    "config.json",
                                                    config,
                                                    (err, ok) => {
                                                        if (!err) {
                                                            hmRouter.back();
                                                        }
                                                    }
                                                );
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
                    console.log("state.taskName changed:", state.taskName);
                    page.updateUI(state.pageData.value);
                });
            }, 700);
        },
        onDestroy() {
            AsyncStorage.SaveAndQuit();
        },
    })
);
