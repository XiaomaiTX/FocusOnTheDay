import { BasePage } from "@zeppos/zml/base-page";

import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as Styles from "zosLoader:./index.[pf].layout.js";
import { ScrollListPage } from "../components/ScrollListPage";
Page(
    BasePage({
        build() {
            console.log(getText("example"));
            const voiceText = `完了完了，感觉要挂科了！
            后天要考微观经济学，笔记还没整理完。
            明天是小组展示的截止日期，PPT才做了一半。
            学生会办的讲座今晚就要开始了，场地布置还没弄。导师催的论文开题报告这周必须交。  
            生活上也是一团麻，宿舍脏得没法看了，该洗的衣服堆成了山。爸妈打电话一直没回，好朋友生日也快忘了。
            还想刷一下实习招聘信息，但根本没时间。
            快帮我看看，我该怎么安排这有限的24小时，哪些是生死线，哪些可以稍微放放？`;
            const testResponse = {
                sortedTasks: {
                    urgent_important: [
                        { task: "完成小组展示PPT" },
                        { task: "提交论文开题报告" },
                    ],
                    not_urgent_important: [
                        { task: "整理微观经济学笔记" },
                        { task: "浏览实习招聘信息" },
                    ],
                    urgent_not_important: [
                        { task: "布置学生会讲座场地" },
                        { task: "回复爸妈电话" },
                        { task: "准备好朋友生日" },
                    ],
                    not_urgent_not_important: [
                        { task: "打扫宿舍" },
                        { task: "洗衣服" },
                    ],
                },
            };
            // const scrollListPageTestData = {
            //     title: getText("about.title"),
            //     items: [
            //         {
            //             title: getText("about.author"),
            //             description: "@XiaomaiTX",
            //         },
            //         {
            //             title: getText("about.email"),
            //             description: "Me@XiaomaiTX.com",
            //         },
            //         {
            //             title: "GitHub",
            //             description: "@XiaomaiTX",
            //         },
            //     ],
            // };

            // 根据testResponse生成scrollListPageTestData示例数据
            const scrollListPageTestData = {
                title: "Tasks",
                items: [],
            };
            // 遍历testResponse.sortedTasks，生成items，每个item的标题是task，描述是优先级类别
            for (const [priority, tasks] of Object.entries(
                testResponse.sortedTasks
            )) {
                tasks.forEach((taskObj) => {
                    let priorityText = "";
                    switch (priority) {
                        case "urgent_important":
                            priorityText = "紧急且重要";
                            break;
                        case "not_urgent_important":
                            priorityText = "不紧急但重要";
                            break;
                        case "urgent_not_important":
                            priorityText = "紧急但不重要";
                            break;
                        case "not_urgent_not_important":
                            priorityText = "不紧急且不重要";
                            break;
                    }
                    scrollListPageTestData.items.push({
                        title: taskObj.task,
                        description: `优先级：${priorityText}`,
                    });
                });
            }
            new ScrollListPage(scrollListPageTestData);


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
        },
    })
);
