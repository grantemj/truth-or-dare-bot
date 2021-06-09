export { checkUserParanoia, addUser, checkUserAns, removeUser };
import { getParanoiaData, setParanoiaData, deleteParanoiaData } from '../mongodbFunctions.js';
async function checkUserParanoia(user, guild) {
    if (user === undefined) {
        return false;
    }
    let userData = await getParanoiaData(user);
    if (userData) {
        return userData.some((a) => { a.guild === guild; });
    }
    else {
        return false;
    }
}
async function addUser(user, guild, channel, question) {
    let userData = await getParanoiaData(user);
    if (userData) {
        userData.push(new ParanoiaQuestion(user, guild, channel, question));
        await setParanoiaData(user, userData);
    }
    else {
        let newUserData = [];
        newUserData.push(new ParanoiaQuestion(user, guild, channel, question));
        await setParanoiaData(user, newUserData);
    }
}
async function checkUserAns(user) {
    let userData = await getParanoiaData(user);
    if (Array.isArray(userData)) {
        if (userData[0] === undefined || !userData[0].hasOwnProperty("time")) {
        }
        else {
            while (Date.now() - userData[0]?.time > 86400000) {
                userData.shift();
            }
            if (userData[0]) {
                await setParanoiaData(user, userData);
                return userData[0];
            }
            else {
                await removeUser(user);
                return undefined;
            }
        }
    }
    else {
        return undefined;
    }
}
async function removeUser(user) {
    let userData = await getParanoiaData(user);
    userData.shift();
    if (userData.length === 0) {
        await deleteParanoiaData(user);
    }
    else {
        await setParanoiaData(user, userData);
    }
}
class ParanoiaQuestion {
    constructor(user, guild, channel, question) {
        this.user = user;
        this.guild = guild;
        this.channel = channel;
        this.question = question;
        this.time = Date.now();
    }
}
