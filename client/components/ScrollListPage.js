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

            const itemStyles = this.mergeStyles(this.styles, itemData.customStyles || {});
            buttonsGroup
                .createWidget(hmUI.widget.FILL_RECT, {
                    ...itemStyles.SETTINGS_BUTTON_STYLE,
                    y:
                        itemStyles.SETTINGS_BUTTON_STYLE.y +
                        this.state.buttonOffset,
                })
                .addEventListener(hmUI.event.CLICK_UP, () => {
                    itemData.action();
                });

            if (itemData && itemData.description) {
                buttonsGroup
                    .createWidget(hmUI.widget.TEXT, {
                        ...itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_SUBTITLE_STYLE.y +
                            this.state.buttonOffset,
                        text: itemData.title,
                    })
                    .setEnable(false);

                if (itemData.value) {
                    buttonsGroup
                        .createWidget(hmUI.widget.TEXT, {
                            ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE
                                    .y + this.state.buttonOffset,
                            text: storage.getKey(itemData.value),
                        })
                        .setEnable(false);
                } else {
                    buttonsGroup
                        .createWidget(hmUI.widget.TEXT, {
                            ...itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE,
                            y:
                                itemStyles.SETTINGS_BUTTON_DESCRIPTION_STYLE
                                    .y + this.state.buttonOffset,
                            text: itemData.description,
                        })
                        .setEnable(false);
                }
            } else if (itemData) {
                buttonsGroup
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
                buttonsGroup
                    .createWidget(hmUI.widget.IMG, {
                        ...itemStyles.SETTINGS_BUTTON_ICON_STYLE,
                        y:
                            itemStyles.SETTINGS_BUTTON_ICON_STYLE.y +
                            this.state.buttonOffset,
                        src: itemData.icon,
                    })
                    .setEnable(false);
            }

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
