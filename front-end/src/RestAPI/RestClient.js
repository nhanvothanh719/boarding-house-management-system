import axios from "axios";

export class RestClient {
  static GetRequest = (getUrl) => {
    return axios.get(getUrl).then(response => {
        return response.data;
    }).catch(error => {
        return null;
    })
  }
}

export default RestClient