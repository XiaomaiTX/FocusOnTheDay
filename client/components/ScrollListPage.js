// import { getText } from "@zos/i18n";
import * as hmUI from "@zos/ui";

import { EasyStorage } from "@silver-zepp/easy-storage";
const storage = new EasyStorage();

export class ScrollListPage {
    /**
     * @param {Object} params
     * @param {string} params.title title of the page
     * @param {Array} params.items list of items to be displayed
     * @param {string} params.items[].title title of the item
     * @param {string} [params.items[].description] description of the item
     * @param {string} [params.items[].value] storage key to get the value to be displayed
     * @param {string} [params.items[].icon] icon of the item
     * @param {Function} [params.items[].action] action to be performed on item click
     * @param {Object} [params.customStyles] custom styles for the page
     */
    constructor(/** @type {Object} */ params) {
        this.state = {
            buttonOffset: 0,
            items: params.items,
            widgets: [],
        };

        this.styles = this.mergeStyles(Styles, params.customStyles || {});

        hmUI.createWidget(hmUI.widget.TEXT, {
            ...this.styles.TITLE_STYLE,
            text: params.title,
        });

        const buttonsGroup = hmUI.createWidget(hmUI.widget.GROUP, {
            ...this.styles.SETTINGS_CONTAINER_STYLE,
            h:
                params.items.length *
                (this.styles.SETTINGS_BUTTON_STYLE.h + px(10)),
        });

        for (let i = 0; i < params.items.length; i++) {
            const itemData = params.items[i];
            const itemStyles = this.mergeStyles(
                this.styles,
                itemData.customStyles || {}
            );

            const buttonBg = buttonsGroup.createWidget(hmUI.widget.FILL_RECT, {
                ...itemStyles.SETTINGS_BUTTON_STYLE,
                y: itemStyles.SETTINGS_BUTTON_STYLE.y + this.state.buttonOffset,
            });
            buttonBg.addEventListener(hmUI.event.CLICK_UP, () => {
                itemData.action();
            });

            const itemWidgets = {
                id: i,
                buttonBg: buttonBg,
                titleWidget: null,
                subtitleWidget: null,
                descriptionWidget: null,
                iconWidget: null,
            };
            if (itemData && itemData.description) {
                itemWidgets.subtitleWidget = buttonsGroup
                    .createWidget(hmUI.widget.TEXT, {
                        ...itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.title,
                    })
                    .setEnable(false);

                if (itemData.value) {
                    itemWidgets.subtitleWidget = buttonsGroup
                        .createWidget(hmUI.widget.TEXT, {
                            ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE.y +
                                this.state.buttonOffset,
                            text: storage.getKey(itemData.value),
                        })
                        .setEnable(false);
                } else {
                    itemWidgets.subtitleWidget = buttonsGroup
                        .createWidget(hmUI.widget.TEXT, {
                            ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE.y +
                                this.state.buttonOffset,
                            text: itemData.description,
                        })
                        .setEnable(false);
                }
            } else if (itemData) {
                itemWidgets.subtitleWidget = buttonsGroup
                    .createWidget(hmUI.widget.TEXT, {
                        ...itemStyles.SETTINGS_BUTTON_TITLE_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_TITLE_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.title,
                    })
                    .setEnable(false);
            }

            if (itemData && itemData.icon) {
                itemWidgets.subtitleWidget = buttonsGroup
                    .createWidget(hmUI.widget.IMG, {
                        ...itemStyles.SETTINGS_BUTTON_ICON_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_ICON_STYLE.y +
                            this.state.buttonOffset,
                        src: itemData.icon,
                    })
                    .setEnable(false);
            }
            this.state.widgets.push(itemWidgets);
            this.state.buttonOffset +=
                itemStyles.SETTINGS_BUTTON_STYLE.h + px(10);
        }
    }
    static setValue(key, value) {
        storage.setKey(key, value);
        console.log(storage.getKey(key));
    }

    static getValue(key) {
        console.log(storage.getKey(key));
        return storage.getKey(key);
    }
     updateItemTextByTitle(title, updates) {
        for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i].title === title) {
                this.updateItemText(i, updates);
            }
        }
    }
     updateItemText(itemIndex, updates) {
        if (itemIndex >= 0 && itemIndex < this.state.widgets.length) {
            const itemWidgets = this.state.widgets[itemIndex];
            const itemData = this.state.items[itemIndex];

            if (updates.title !== undefined && itemWidgets.subtitleWidget) {
                console.log("updates.title", updates.title);
                itemWidgets.subtitleWidget.setProperty(
                    hmUI.prop.MORE,{
                        x: itemWidgets.subtitleWidget.getProperty(hmUI.prop.X),
                        y: itemWidgets.subtitleWidget.getProperty(hmUI.prop.Y),
                        w: itemWidgets.subtitleWidget.getProperty(hmUI.prop.W),
                        h: itemWidgets.subtitleWidget.getProperty(hmUI.prop.H),
                        text: updates.title
                    }
                );
                itemData.title = updates.title;
            }

            if (
                updates.description !== undefined &&
                itemWidgets.descriptionWidget
            ) {
                console.log("updates.description", updates.description);
                itemWidgets.descriptionWidget.setProperty(
                    hmUI.prop.MORE, {
                        x: itemWidgets.descriptionWidget.getProperty(hmUI.prop.X),
                        y: itemWidgets.descriptionWidget.getProperty(hmUI.prop.Y),
                        w: itemWidgets.descriptionWidget.getProperty(hmUI.prop.W),
                        h: itemWidgets.descriptionWidget.getProperty(hmUI.prop.H),
                        text: updates.description
                    }
                );
                itemData.description = updates.description;
            }

            if (
                updates.value !== undefined &&
                itemData.value &&
                itemWidgets.descriptionWidget
            ) {
                console.log("updates.value", updates.value);
                storage.setKey(itemData.value, updates.value);
                itemWidgets.descriptionWidget.setProperty(
                    hmUI.prop.MORE, {
                        x: itemWidgets.descriptionWidget.getProperty(hmUI.prop.X),
                        y: itemWidgets.descriptionWidget.getProperty(hmUI.prop.Y),
                        w: itemWidgets.descriptionWidget.getProperty(hmUI.prop.W),
                        h: itemWidgets.descriptionWidget.getProperty(hmUI.prop.H),
                        text: updates.value
                    }
                );
            }
        }
    }
    static refreshDisplayValues() {
        for (let i = 0; i < this.state.widgets.length; i++) {
            const itemWidgets = this.state.widgets[i];
            const itemData = this.state.items[i];

            if (itemData.value && itemWidgets.descriptionWidget) {
                const storedValue = storage.getKey(itemData.value);
                itemWidgets.descriptionWidget.setProperty(
                    hmUI.prop.MORE,{
                        x: itemWidgets.descriptionWidget.getProperty(hmUI.prop.X),
                        y: itemWidgets.descriptionWidget.getProperty(hmUI.prop.Y),
                        w: itemWidgets.descriptionWidget.getProperty(hmUI.prop.W),
                        h: itemWidgets.descriptionWidget.getProperty(hmUI.prop.H),
                        text: storedValue
                    }
                );
                itemData.description = storedValue;
            }
        }
    }
    mergeStyles(defaultStyles, customStyles) {
        const merged = { ...defaultStyles };

        for (const [key, value] of Object.entries(customStyles)) {
            if (
                merged[key] &&
                typeof merged[key] === "object" &&
                typeof value === "object"
            ) {
                merged[key] = { ...merged[key], ...value };
            } else {
                merged[key] = value;
            }
        }

        return merged;
    }
}

const Styles = {
    TITLE_STYLE: {
        x: px(50),
        y: px(100),
        w: px(380),
        h: px(70),
        color: 0xffffff,
        text_size: px(48),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "HELLO, Zepp OS",
    },
    SETTINGS_CONTAINER_STYLE: {
        x: px(30),
        y: px(180),
        w: px(420),
        h: px(80),
    },
    SETTINGS_TEXT_STYLE: {
        x: px(20),
        y: px(0),
        w: px(420),
        h: px(35),
        color: 0x9e9e9e,
        text_size: px(24),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_STYLE: {
        x: px(0),
        y: px(0),
        w: px(420),
        h: px(80),
        radius: px(10),
        color: 0x0a0a0a,
    },
    SETTINGS_BUTTON_TITLE_STYLE: {
        x: px(20),
        y: px(23),
        w: px(380),
        h: px(35),
        color: 0xffffff,
        text_size: px(24),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },

    SETTINGS_BUTTON_SUBTITLE_STYLE: {
        x: px(20),
        y: px(8),
        w: px(380),
        h: px(35),
        color: 0xffffff,
        text_size: px(20),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_DESCRIPTION_STYLE: {
        x: px(20),
        y: px(37),
        w: px(380),
        h: px(35),
        color: 0x9e9e9e,
        text_size: px(20),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text: "",
    },
    SETTINGS_BUTTON_ICON_STYLE: {
        x: px(375),
        y: px(29),
        w: px(24),
        h: px(24),
    },
};
