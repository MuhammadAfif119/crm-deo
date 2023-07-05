import axios from "axios";

const url = process.env.REACT_APP_SLACK;

const defaultSlackMessage = {
  channel: "#general",
  username: "webhookBot",
  text: "",
  icon_emoji: ":ghost:",
};

const postSlackMessage = async (message) => {
  try {
    await axios.post(url, `payload=${JSON.stringify(message)}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const errorSlack = async (error, platform) => {
  const slackMessage = {
    ...defaultSlackMessage,
    text: `error in ${error} at ${platform}`,
  };

//   try {
//     const result = await postSlackMessage(slackMessage);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to send Slack error message");
//   }
};

export const loginSlack = async (data, platform) => {
  const slackMessage = {
    ...defaultSlackMessage,
    text: `${data} logged in ${new Date()} at ${platform}`,
    channel: "#login",
    icon_emoji: ":wave:",
  };

//   try {
//     const result = await postSlackMessage(slackMessage);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to send Slack login message");
//   }
};

export const logoutSlack = async (data, platform) => {
  const slackMessage = {
    ...defaultSlackMessage,
    text: `${data} logged out ${new Date()} at ${platform}`,
    channel: "#logout",
    icon_emoji: ":wave:",
  };

//   try {
//     const result = await postSlackMessage(slackMessage);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to send Slack logout message");
//   }
};
