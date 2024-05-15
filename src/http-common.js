import axios from "axios";

export default axios.create({
  baseURL: "https://c3e0-105-235-128-81.ngrok-free.app/",
  headers: {
    "Content-type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});
