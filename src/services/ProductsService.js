import http from "../http-common";

const getAll = () => {
  return http.get("/Products");
};

const get = (id) => {
  return http.get(`/Products/${id}`);
};

const create = (data) => {
  return http.post("/Products", data);
};

const update = (id, data) => {
  return http.put(`/Products/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/Products/${id}`);
};

const removeAll = () => {
  return http.delete(`/Products`);
};

const findByNAME = (NAME) => {
  return http.get(`/Products?name=${NAME}`);
};

const ProductService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByNAME,
};

export default ProductService;
