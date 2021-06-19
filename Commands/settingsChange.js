export { settingsChange };
import { handler } from '../bot.js';
async function settingsChange(channelID, channelSettings, settingNames, value) {
    for (let settingName of settingNames) {
        if (settingName === "show paranoia" && typeof value === "string") {
            channelSettings[settingName] = value;
        }
        else if (settingName !== "show paranoia" && typeof value === "boolean") {
            channelSettings[settingName] = value;
        }
    }
    handler.query("setChannelSettings", channelID, channelSettings);
}
