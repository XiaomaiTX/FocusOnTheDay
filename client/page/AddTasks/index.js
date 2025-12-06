import { BasePage } from "@zeppos/zml/base-page";

import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as zosApp from "@zos/app";
import { statSync } from "@zos/fs";

import { SoundRecorder } from "@silver-zepp/easy-media/recorder";

import { ScrollListPage } from "../../components/ScrollListPage";
import { px } from "@zos/utils";

const recorder = new SoundRecorder("mic-recording.opus");
Page(
    BasePage({
        state: {
            voiceText: "",
            recordConditions: {
                IDLE: "idle",
                RECORDING: "recording",
            },
            recordCondition: "idle",
        },
        onInit() {
            console.log(getText("example"));
        },
        build() {
            console.log(getText("example"));
            const voiceText = `完了完了，感觉要挂科了！
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

            // 根据testResponse生成scrollListPageTestData示例数据
            const scrollListPageTestData = {
                title: "Tasks",
                items: [],
            };
            // 遍历testResponse.sortedTasks，生成items，每个item的标题是task，描述是优先级类别
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
            const recordButton = hmUI.createWidget(hmUI.widget.BUTTON, {
                x: px((480 - 200) / 2),
                y: px(400),
                w: px(200),
                h: px(60),
                radius: px(12),
                normal_color: 0xe5e5e5,
                press_color: 0xcfcfcf,
                color: 0x000000,
                text: "Tap To Speak",
                click_func: () => {
                    console.log("button clicked");
                    if (
                        this.state.recordCondition ===
                        this.state.recordConditions.IDLE
                    ) {
                        console.log("开始录音");
                        this.state.recordCondition =
                            this.state.recordConditions.RECORDING;
                        recordButton.setProperty(hmUI.prop.MORE, {
                            x: recordButton.getProperty(hmUI.prop.X),
                            y: recordButton.getProperty(hmUI.prop.Y),
                            w: recordButton.getProperty(hmUI.prop.W),
                            h: recordButton.getProperty(hmUI.prop.H),

                            text: "Stop",
                        });
                        recorder.start();
                    } else if (
                        this.state.recordCondition ===
                        this.state.recordConditions.RECORDING
                    ) {
                        console.log("结束录音");
                        this.state.recordCondition =
                            this.state.recordConditions.IDLE;
                        recordButton.setProperty(hmUI.prop.MORE, {
                            x: recordButton.getProperty(hmUI.prop.X),
                            y: recordButton.getProperty(hmUI.prop.Y),
                            w: recordButton.getProperty(hmUI.prop.W),
                            h: recordButton.getProperty(hmUI.prop.H),
                            text: "Processing...",
                        });
                        recorder.stop();
                        setTimeout(() => {
                            const result = statSync({
                            path: "mic-recording.opus",
                        });
                        console.log("[mic-recording.opus] result:", result);

                        if (result) {
                            const { size } = result;
                            console.log("[mic-recording.opus] size:", size);
                        }
                        },5000)
                        
                    }
                },
            });
            // new ScrollListPage(scrollListPageTestData);
        },
    })
);
