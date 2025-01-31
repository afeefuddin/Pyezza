import axios from "axios";

export class Api {
  url: string;
  constructor(url: string) {
    this.url = url;
  }
  async GET(route: string) {
    const response = await axios.get(this.url + route);
    return response.data;
  }
  async POST(route: string, headers?) {
    const response = await axios.get(this.url + route);
    return response.data;
  }
}
