import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";
import * as hmRouter from "@zos/router";
import * as hmSensor from "@zos/sensor";
import * as hmDisplay from "@zos/display";

import { BasePage } from "@zeppos/zml/base-page";
import { AsyncStorage } from "@silver-zepp/easy-storage";

import { ProgressArc } from "../../components/ui/progress-arc";
import { TextTyper } from "../../components/ui/text-typer";

const time = new hmSensor.Time();

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
        },
        build() {
            const arc = new ProgressArc();
            arc.start();

			setTimeout(() => {
				arc.stop();
				arc.destroy();
				const textWidget = new TextTyper({
					text: {
						x: px(20),
						y: px((480 - 36) / 2),
						w: px(480),
						color: 0xffffff,
						text_size: px(26),
						text: [
							//Guide text
							getText("guide_text_1"),
							getText("guide_text_2"),
							getText("guide_text_3"),
							getText("guide_text_4"),
						],
					},
					charInterval: 50,
				});
				textWidget.start(() => {
					console.log("text typer finished");

					if (!err) {
						console.log("config.json saved");
						const mask = hmUI.createWidget(hmUI.widget.TEXT, {
							x: px(0),
							y: px(0),
							w: px(480),
							h: px(480),
							color: 0xffffff,
							text_size: px(30),
							text: getText("guide_start_your_day"),
							align_h: hmUI.align.CENTER_H,
							align_v: hmUI.align.CENTER_V,
						});
						mask.addEventListener(hmUI.event.CLICK_UP, () => {
							arc.start();
							AsyncStorage.WriteJson(
								"config.json",
								{
									version: "1.0",
									tasks: [
										{
											name: getText(
												"default_task_budget_report",
											),
											today: true,
											priority: "urgent_important",
											notificationTime:
												"2024-06-01T10:00:00",
										},
										{
											name: getText(
												"default_task_regular_meeting",
											),
											today: true,
											priority: "urgent_not_important",
										},
										{
											name: getText(
												"default_task_workout",
											),
											today: true,
											priority: "not_urgent_important",
										},
										{
											name: getText(
												"default_task_reply_client_emails",
											),
											today: false,
											priority: "urgent_not_important",
										},
										{
											name: getText(
												"default_task_organize_desktop",
											),
											today: false,
											priority:
												"not_urgent_not_important",
										},
									],
									settings: {
										daily_notifications: true,
										notification_time: "09:00",
										backend_url: "https://api.example.com",
										user_profile_description: "",
										last_open_timestamp: time.getTime,
									},
								},
								(err, ok) => {
									if (ok) console.log("config saved!");
									hmRouter.push({
										url: "page/home/index",
									});
								},
							);
						});
					}
				});
			}, 700);
		},
		onDestroy() {
			AsyncStorage.SaveAndQuit();
		},
	}),
);
