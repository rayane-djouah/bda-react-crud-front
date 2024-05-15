import axios from "axios";

export default axios.create({
  baseURL: "https://2a86-105-103-131-130.ngrok-free.app/",
  headers: {
    "Content-type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});
