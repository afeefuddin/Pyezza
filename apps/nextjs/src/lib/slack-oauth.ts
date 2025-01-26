import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";

export class SlackOauth {
  private static SlackOauthURL = "https://slack.com/oauth/v2/authorize";
  private static AccessURL = "https://slack.com/api/oauth.v2.access";
  client_id: string;
  private client_secret: string;
  private static slackResponseSchema = z.object({
    access_token: z.string(),
    scope: z.string(),
    bot_user_id: z.string(),
    app_id: z.string(),
    team: z.object({
      name: z.string(),
      id: z.string(),
    }),
  });

  constructor() {
    this.client_id = String(process.env.SLACK_CLIENT_ID);
    this.client_secret = String(process.env.SLACK_CLIENT_SECRET);
  }

  async getAuthUrl() {
    const state = SlackOauth.getRandomString();
    await this.setState(state);
    const queryParams = new URLSearchParams({
      client_id: this.client_id,
      scope: String(process.env.SLACK_CLIENT_SCOPE),
      redirect_uri: String(process.env.SLACK_REDIRECT_URI),
      state: state,
      response_type: "code",
      team: "",
    });
    return SlackOauth.SlackOauthURL + "?" + queryParams.toString();
  }

  async getAccessTokenFromCode(code: string) {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("client_id", this.client_id);
    formData.append("client_secret", this.client_secret);
    try {
      const response = await axios.post(SlackOauth.AccessURL, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const data = response.data;
      console.log(data)
      const parsedData = SlackOauth.slackResponseSchema.parse(data);
      return parsedData;
    } catch {
      console.log("error here")
      return null;
    }
  }

  async verifyState(state: string | null) {
    const originalState = await this.getState();
    return originalState === state;
  }

  private async getState() {
    const cookieStore = await cookies();
    const state = cookieStore.get("state");
    return state?.value;
  }

  private async setState(state: string) {
    const cookieStore = await cookies();
    cookieStore.set("state", state, {
      secure: true,
      httpOnly: true,
      path: "/",
      maxAge: 300,
    });
  }

  private static getRandomString() {
    return crypto.randomUUID();
  }
}
