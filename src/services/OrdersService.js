import http from "../http-common";

const getAll = () => {
  return http.get("/Orders");
};

const get = (id) => {
  return http.get(`/Orders/${id}`);
};

const create = (data) => {
  return http.post("/Orders", data);
};

const update = (id, data) => {
  return http.put(`/Orders/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/Orders/${id}`);
};

const removeAll = () => {
  return http.delete(`/Orders`);
};

const findByNAME = (NAME) => {
  return http.get(`/Products?name=${NAME}`);
};

const OrderService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByNAME,
};

export default OrderService;
