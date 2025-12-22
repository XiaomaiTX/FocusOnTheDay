import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmApp from "@zos/app";
import { statSync } from "@zos/fs";
import { px } from "@zos/utils";
import * as hmDisplay from "@zos/display";

import { BasePage } from "@zeppos/zml/base-page";
import { reactive, effect, computed } from "@x1a0ma17x/zeppos-reactive";

import { ScrollListPage } from "../../components/ScrollListPage";

const state = reactive({
    inputText: "",
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
            state.inputText = `完了完了，感觉要挂科了！
            后天要考微观经济学，笔记还没整理完。
            明天是小组展示的截止日期，PPT才做了一半。
            学生会办的讲座今晚就要开始了，场地布置还没弄。导师催的论文开题报告这周必须交。  
            生活上也是一团麻，宿舍脏得没法看了，该洗的衣服堆成了山。爸妈打电话一直没回，好朋友生日也快忘了。
            还想刷一下实习招聘信息，但根本没时间。
            快帮我看看，我该怎么安排这有限的24小时，哪些是生死线，哪些可以稍微放放？`;

            // const response = this.httpRequest({
            //     method: "post",
            //     url: "https://n8n.cafero.town/webhook/fotd",
            //     body: { text: voiceText },
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            // })
            //     .then((result) => {
            //         console.log("result.status", result.status);
            //         console.log("result.statusText", result.statusText);
            //         console.log("result.headers", result.headers);
            //         console.log("result.body", JSON.stringify(result.body, null, 2));
            //         textWidget.setProperty(hmUI.prop.TEXT, JSON.stringify(result.body.sortedTasks, null, 2));
            //     })
            //     .catch((error) => {
            //         console.error("error=>", error);
            //     });

            const testResponse = {
                classifiedTasks: [
                    {
                        task: "提交报告",
                        priority: "urgent_important",
                    },
                    {
                        task: "回复客户邮件",
                        priority: "urgent_not_important",
                    },
                    {
                        task: "学习新技能",
                        priority: "not_urgent_important",
                    },
                    {
                        task: "整理桌面",
                        priority: "not_urgent_not_important",
                    },
                ],
            };

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

            testResponse.classifiedTasks.forEach((taskObj) => {
                scrollListPageTestData.items.push({
                    title: taskObj.task,
                    description: priorityMap[taskObj.priority] || "未知优先级",
                });
            });

            const voiceButton = hmUI.createWidget(hmUI.widget.BUTTON, {
                x: px(156),
                y: px(360),
                w: -1,
                h: -1,
                normal_src: "voiceButton@1x.png",
                press_src: "voiceButton_press@1x.png",
                click_func: () => {
                    console.log("button click");
                },
            });
            const keyboardButton = hmUI.createWidget(hmUI.widget.BUTTON, {
                x: px(260),
                y: px(360),
                w: -1,
                h: -1,
                normal_src: "keyboardButton@1x.png",
                press_src: "keyboardButton_press@1x.png",
                click_func: () => {
                    console.log("button click");
                },
            });
            // new ScrollListPage(scrollListPageTestData);
        },
    })
);
