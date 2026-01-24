import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import * as hmRouter from "@zos/router";
import { Time } from "@zos/sensor";
import * as hmDisplay from "@zos/display";
import * as hmInteraction from "@zos/interaction";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ProgressArc } from "../components/ui/progress-arc";
import { TextTyper } from "../components/ui/text-typer";

const time = new Time();

class WelcomeMessageGenerator {
	constructor() {
		this.welcomeWords = {
			earlyMorning: [
				"greeting_early_morning_1",
				"greeting_early_morning_2",
				"greeting_early_morning_3",
			],
			morning: [
				"greeting_morning_1",
				"greeting_morning_2",
				"greeting_morning_3",
			],
			noon: ["greeting_noon_1", "greeting_noon_2"],
			afternoon: ["greeting_afternoon_1", "greeting_afternoon_2"],
			evening: ["greeting_evening_1", "greeting_evening_2"],
			night: ["greeting_night_1", "greeting_night_2", "greeting_night_3"],
		};

		this.periodNames = {
			earlyMorning: "period_early_morning",
			morning: "period_morning",
			noon: "period_noon",
			afternoon: "period_afternoon",
			evening: "period_evening",
			night: "period_night",
		};
	}

	getPeriod(hours) {
		if (hours >= 0 && hours < 5) return "earlyMorning";
		if (hours >= 5 && hours < 12) return "morning";
		if (hours >= 12 && hours < 14) return "noon";
		if (hours >= 14 && hours < 17) return "afternoon";
		if (hours >= 17 && hours < 21) return "evening";
		return "night";
	}

	getRandomWelcome() {
		const hours = time.getHours();
		const period = this.getPeriod(hours);
		const messages = this.welcomeWords[period];

		if (!messages || messages.length === 0) {
			return getText("greeting_default");
		}

		const randomIndex = Math.floor(Math.random() * messages.length);
		return {
			message: getText(messages[randomIndex]),
			period: period,
			periodName: getText(this.periodNames[period]),
			hour: hours,
		};
	}

	showWelcome() {
		const welcome = this.getRandomWelcome();
		console.log(
			`[${welcome.periodName} ${welcome.hour}:00] ${welcome.message}`,
		);
		return welcome.message;
	}
}
const welcomeGenerator = new WelcomeMessageGenerator();

function isFirstOpenTodaySimple(currentTime, lastOpenTime) {
	if (!lastOpenTime || lastOpenTime === 0) return true;

	const currentDate = new Date(currentTime).toDateString();
	const lastOpenDate = new Date(lastOpenTime).toDateString();

	return currentDate !== lastOpenDate;
}

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
					if (event === hmInteraction.GESTURE_UP) {
						console.log("up");
						hmRouter.home();
					}
					return true;
				},
			});
			this.arc = new ProgressArc();
			this.arc.start();
		},
		build() {
			AsyncStorage.ReadJson("config.json", (err, config) => {
				if (!err) {
					console.log("config.json found");
					const unfinishedTasks = config.tasks.filter(
						(task) => !task.today,
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
								config.last_open_time,
							)
							// true
						) {
							welcomeGenerator.showWelcome();
							config.last_open_time = time.getTime();
							AsyncStorage.WriteJson(
								"config.json",
								config,
								() => {
									this.textWidget = new TextTyper({
										cursorEnable: false,
										text: {
											x: px(0),
											y: px((480 - 36) / 2),
											w: px(480),
											color: 0xffffff,
											text_size: px(26),
											align_h: hmUI.align.CENTER_H,
											text: [
												welcomeGenerator.getRandomWelcome()
													.message,
												unfinishedTasks.length === 0
													? getText(
															"all_tasks_completed",
														)
													: getText(
															"tasks_pending_yesterday",
														).replace(
															"%d",
															unfinishedTasks.length,
														),
												getText("how_are_you_today"),
												// `昨天还有${unfinishedTasks.length}个任务待完成哦~`,
											],
										},
										charInterval: 50,
									});
									this.textWidget.start(() => {
										console.log("text typer finished");
										hmRouter.push({
											url: "page/home/index",
										});
									});
								},
							);
						} else {
							this.textWidget = new TextTyper({
								cursorEnable: false,
								text: {
									x: px(0),
									y: px((480 - 36) / 2),
									w: px(480),
									color: 0xffffff,
									text_size: px(26),
									align_h: hmUI.align.CENTER_H,
									text: [
										getText("tasks_pending_today").replace(
											"%d",
											config.tasks.length,
										),
									],
								},
								charInterval: 50,
							});
							this.textWidget.start(() => {
								console.log("text typer finished");
								hmRouter.push({
									url: "page/home/index",
								});
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
	}),
);
