import { getText } from "@zos/i18n";
import { px } from "@zos/utils";
import * as hmUI from "@zos/ui";
import * as hmInteraction from "@zos/interaction";
import * as hmDisplay from "@zos/display";
import * as hmRouter from "@zos/router";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ScrollListPage } from "../../components/ScrollListPage";
import { ProgressArc } from "../../components/ui/progress-arc";

import { priorityMap, priorityColorMap } from "../../enums/task";

const arc = new ProgressArc();

const state = reactive({
    pageData: {},
    inputText: `完了完了，感觉要挂科了！
            后天要考微观经济学，笔记还没整理完。
            明天是小组展示的截止日期，PPT才做了一半。
            学生会办的讲座今晚就要开始了，场地布置还没弄。导师催的论文开题报告这周必须交。  
            生活上也是一团麻，宿舍脏得没法看了，该洗的衣服堆成了山。爸妈打电话一直没回，好朋友生日也快忘了。
            还想刷一下实习招聘信息，但根本没时间。
            快帮我看看，我该怎么安排这有限的24小时，哪些是生死线，哪些可以稍微放放？`,
    tasks: [],
    widgets: {},
});

Page(
    BasePage({
        state: {},
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

            console.log(getText("example"));
        },
        build() {
            console.log(getText("example"));

            state.PageData = computed(() => {
                return {
                    title: "Confirm Tasks",
                    items: [
                        ...state.tasks.map((taskObj) => {
                            return {
                                title: taskObj.name,
                                description:
                                    priorityMap[taskObj.priority] ||
                                    "未知优先级",
                                customStyles: {
                                    SETTINGS_BUTTON_SUBTITLE_STYLE: {
                                        color: priorityColorMap[
                                            taskObj.priority
                                        ],
                                    },
                                },
                            };
                        }),
                        {
                            title: "Save",
                            icon: "gear-fill.png",
                            action: () => {
                                AsyncStorage.ReadJson(
                                    "config.json",
                                    (err, config) => {
                                        if (!err) {
                                            for (const taskObj of state.tasks) {
                                                config.tasks.push(taskObj);
                                            }
                                            AsyncStorage.WriteJson(
                                                "config.json",
                                                config,
                                                (err, ok) => {
                                                    if (ok) {
                                                        console.log(
                                                            "config.json saved"
                                                        );
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

            effect(() => {
                console.log("[effect]");
                // arc.start();
            });
            effect(() => {
                state.tasks;
                console.log("[effect] state.tasks:", state.tasks);
                if (state.widgets.scrollListPage) {
                    state.widgets.scrollListPage.updateUI(state.PageData.value);
                }
                // arc.start();
            });

            const voiceSupportDialog = hmInteraction.createModal({
                content: "当前设备不支持语音输入",
                show: false,
                autoHide: false,
                onClick: (keyObj) => {
                    const { type } = keyObj;
                    if (type === hmInteraction.MODAL_CONFIRM) {
                        console.log("confirm");
                        voiceSupportDialog.show(false);
                    } else {
                        voiceSupportDialog.show(false);
                    }
                },
            });
            state.widgets.voiceButton = hmUI.createWidget(hmUI.widget.BUTTON, {
                ...this.Layout.VOICE_BUTTON_LAYOUT,
                ...this.Styles.VOICE_BUTTON_STYLE,
                click_func: () => this.voiceButtonClick(),
            });
            state.widgets.keyboardButton = hmUI.createWidget(
                hmUI.widget.BUTTON,
                {
                    ...this.Layout.KEYBOARD_BUTTON_LAYOUT,
                    ...this.Styles.KEYBOARD_BUTTON_STYLE,
                    click_func: () => this.keyboardButtonClick(),
                }
            );
        },
        voiceButtonClick: function () {
            hmUI.keyboard.clearInput();
            hmUI.createKeyboard({
                inputType: hmUI.inputType.VOICE,
                onComplete: (_, result) => {
                    console.log("输入内容:", result.data);
                    hmUI.deleteKeyboard();
                    // this.generateTaskList(result.data);
                },
                onCancel: (_, result) => {
                    console.log("取消输入");
                    hmUI.deleteKeyboard();
                },
                text: "", // 初始化文本
            });
        },
        keyboardButtonClick: function () {
            hmUI.keyboard.clearInput();
            hmUI.createKeyboard({
                inputType: hmUI.inputType.JSKB,
                onComplete: (_, result) => {
                    console.log("输入内容:", result.data);
                    // state.inputText = result.data;
                    state.tasks = this.generateTaskList(result.data);
                    for (const task of state.tasks) {
                        task.today = true;
                    }
                    state.widgets.scrollListPage = new ScrollListPage(
                        state.PageData.value
                    );

                    console.log("state.tasks length:", state.tasks.length);

                    // this.httpRequest({
                    //     method: "post",
                    //     url: "http://cafero-n8n:5678/webhook-test/gen_task_list",
                    //     body: { text: userInout },
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    // })
                    //     .then((result) => {
                    //         console.log("result.status", result.status);
                    //         console.log("result.statusText", result.statusText);
                    //         console.log("result.headers", result.headers);
                    //         console.log(
                    //             "result.body",
                    //             JSON.stringify(result.body, null, 2)
                    //         );

                    //     })
                    //     .catch((error) => {
                    //         console.error("error=>", error);
                    //     });

                    hmUI.deleteWidget(state.widgets.voiceButton);
                    hmUI.deleteWidget(state.widgets.keyboardButton);

                    hmUI.deleteKeyboard();
                },
                onCancel: (_, result) => {
                    console.log("取消输入");
                    hmUI.deleteKeyboard();
                },
                text: "", // 初始化文本
            });
        },
        generateTaskList: function (userInout) {
            const testResponse = {
                classifiedTasks: [
                    {
                        name: "提交报告",
                        priority: "urgent_important",
                    },
                    {
                        name: "回复客户邮件",
                        priority: "urgent_not_important",
                    },
                    {
                        name: "学习新技能",
                        priority: "not_urgent_important",
                    },
                    {
                        name: "整理桌面",
                        priority: "not_urgent_not_important",
                    },
                ],
            };
            return testResponse;
        },
        Layout: {
            VOICE_BUTTON_LAYOUT: {
                x: px(156),
                y: px(360),
                w: -1,
                h: -1,
            },
            KEYBOARD_BUTTON_LAYOUT: {
                x: px(260),
                y: px(360),
                w: -1,
                h: -1,
            },
        },
        Styles: {
            VOICE_BUTTON_STYLE: {
                normal_src: "voiceButton@1x.png",
                press_src: "voiceButton_press@1x.png",
            },
            KEYBOARD_BUTTON_STYLE: {
                normal_src: "keyboardButton@1x.png",
                press_src: "keyboardButton_press@1x.png",
            },
        },
    })
);
