import axios from "axios";

export default axios.create({
  baseURL: "https://bd07-197-207-65-142.ngrok-free.app",
  headers: {
    "Content-type": "application/json",
  },
});
