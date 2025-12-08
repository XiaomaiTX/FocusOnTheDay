import { BasePage } from "@zeppos/zml/base-page";

import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as hmRouter from "@zos/router";
import { Time } from "@zos/sensor";

import { ProgressArc } from "../components/ui/progress-arc";
import { AsyncStorage } from "@silver-zepp/easy-storage";
import { TextTyper } from "../components/ui/text-typer";

const time = new Time();

class WelcomeMessageGenerator {
    constructor() {
        this.welcomeWords = {
            earlyMorning: [
                "凌晨好！夜深人静，思绪最清晰～",
                "凌晨好！星星和月亮都在陪伴你～",
                "凌晨好！新的一天即将开始！",
            ],
            morning: [
                "早上好！元气满满的一天开始啦！",
                "早安！今天也要加油哦！",
                "早上好！愿你有个美好的一天！",
            ],
            noon: [
                "中午好！记得按时吃午餐哦！",
                "午安！午休时间到了，休息一下吧～",
            ],
            afternoon: ["下午好！下午茶时间到啦！", "下午好！继续保持好状态！"],
            evening: ["晚上好！晚餐吃了吗？", "晚上好！今天过得怎么样？"],
            night: ["晚安！早点休息哦～", "夜深了，该睡觉啦！", "晚安！好梦～"],
        };

        this.periodNames = {
            earlyMorning: "凌晨",
            morning: "早晨",
            noon: "中午",
            afternoon: "下午",
            evening: "晚上",
            night: "深夜",
        };
    }

    // 获取时间段
    getPeriod(hours) {
        if (hours >= 0 && hours < 5) return "earlyMorning";
        if (hours >= 5 && hours < 12) return "morning";
        if (hours >= 12 && hours < 14) return "noon";
        if (hours >= 14 && hours < 17) return "afternoon";
        if (hours >= 17 && hours < 21) return "evening";
        return "night";
    }

    // 获取随机的欢迎语
    getRandomWelcome() {
        const hours = time.getHours();
        const period = this.getPeriod(hours);
        const messages = this.welcomeWords[period];

        if (!messages || messages.length === 0) {
            return "你好！欢迎光临！";
        }

        const randomIndex = Math.floor(Math.random() * messages.length);
        return {
            message: messages[randomIndex],
            period: period,
            periodName: this.periodNames[period],
            hour: hours,
        };
    }

    // 获取欢迎语并显示
    showWelcome() {
        const welcome = this.getRandomWelcome();
        console.log(
            `[${welcome.periodName} ${welcome.hour}:00] ${welcome.message}`
        );
        return welcome.message;
    }
}
const welcomeGenerator = new WelcomeMessageGenerator();

function isFirstOpenTodaySimple(currentTime, lastOpenTime) {
    // 1. 边界情况处理
    if (!lastOpenTime || lastOpenTime === 0) return true;

    // 2. 日期转换和比较
    const currentDate = new Date(currentTime).toDateString();
    const lastOpenDate = new Date(lastOpenTime).toDateString();

    // 3. 返回比较结果
    return currentDate !== lastOpenDate;
}

Page(
    BasePage({
        onInit() {
            this.arc = new ProgressArc();
            this.arc.start();

            // Debug
        },
        build() {
            // DEBUG
            hmRouter.push({
                url: "page/settings/index",
            });
            const button = hmUI.createWidget(hmUI.widget.BUTTON, {
                x: px(60),
                y: px(400),
                w: px(480 - 120),
                h: px(60),
                radius: 12,
                normal_color: 0xe5e5e5,
                press_color: 0xcfcfcf,
                color: 0x000000,
                text: "开始",
                click_func: () => {
                    console.log("button clicked");
                    hmRouter.push({
                        url: "page/home/index",
                    });
                },
            });
            button.setProperty(hmUI.prop.VISIBLE, false);
            AsyncStorage.ReadJson("config.json", (err, config) => {
                if (!err) {
                    console.log("config.json found");
                    const unfinishedTasks = config.tasks.filter(
                        (task) => !task.done
                    );
                    setTimeout(() => {
                        this.arc.stop();
                        this.arc.destroy();
                        // Today first Open
                        // 判断是否是今天第一次打开
                        // time.getTime()是现在的UTC时间戳
                        // config.last_open_time是上次打开的时间戳
                        if (
                            isFirstOpenTodaySimple(
                                time.getTime(),
                                config.last_open_time
                            )
                        ) {
                            welcomeGenerator.showWelcome();
                            config.last_open_time = time.getTime();
                            AsyncStorage.WriteJson(
                                "config.json",
                                config,
                                () => {
                                    this.textWidget = new TextTyper({
                                        text: {
                                            x: px(20),
                                            y: px((480 - 36) / 2),
                                            w: px(480),
                                            h: px(480),
                                            color: 0xffffff,
                                            text_size: px(26),
                                            text: [
                                                welcomeGenerator.getRandomWelcome()
                                                    .message,
                                                // "今天感觉怎么样？",
                                                // `昨天还有${unfinishedTasks.length}个任务待完成哦~`,
                                            ],
                                        },
                                        charInterval: 50,
                                    });
                                    this.textWidget.start(() => {
                                        console.log("text typer finished");
                                        button.setProperty(
                                            hmUI.prop.VISIBLE,
                                            true
                                        );
                                    });
                                }
                            );
                        } else {
                            this.textWidget = new TextTyper({
                                text: {
                                    x: px(20),
                                    y: px((480 - 36) / 2),
                                    w: px(480),
                                    h: px(480),
                                    color: 0xffffff,
                                    text_size: px(26),
                                    text: [
                                        `今天还有${config.tasks.length}个任务待完成哦~`,
                                    ],
                                },
                                charInterval: 50,
                            });
                            this.textWidget.start(() => {
                                console.log("text typer finished");
                                button.setProperty(hmUI.prop.VISIBLE, true);
                            });
                        }
                    }, 500);
                } else {
                    console.log("config.json not found");
                    hmRouter.push({
                        url: "page/guide/index",
                    });
                }
            });
        },

        onDestroy() {
            this.arc.stop();
            this.arc.destroy();
        },
    })
);
