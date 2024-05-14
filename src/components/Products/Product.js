import React, { useState, useEffect } from "react";
import ProductDataService from "../../services/ProductsService";

const Product = (props) => {
  const initialProductState = {
    id: 0,
    product_code: "",
    name: "",
    description: "",
    category_id: 0,
    price: 0,
    stock: 0,
    published: true,
  };
  const [currentProduct, setCurrentProduct] = useState(initialProductState);
  const [message, setMessage] = useState("");

  const getProduct = (id) => {
    ProductDataService.get(id)
      .then((response) => {
        setCurrentProduct(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getProduct(props.match.params.ID);
  }, [props.match.params.ID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const updatePublished = (status) => {
    var data = {
      id: currentProduct.id,
      product_code: currentProduct.product_code,
      name: currentProduct.name,
      description: currentProduct.description,
      category_id: currentProduct.category_id,
      price: currentProduct.price,
      stock: currentProduct.stock,
    };

    ProductDataService.update(currentProduct.id, data)
      .then((response) => {
        setCurrentProduct({ ...currentProduct, published: status });
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateProduct = () => {
    ProductDataService.update(currentProduct.id, currentProduct)
      .then((response) => {
        console.log(response.data);
        setMessage("The Product was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteProduct = () => {
    ProductDataService.remove(currentProduct.id)
      .then((response) => {
        console.log(response.data);
        props.history.push("/Products");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentProduct ? (
        <div className="edit-form">
          <h4>Product</h4>
          <form>
            <div className="form-group">
              <label htmlFor="product_code">Product Code</label>
              <input
                type="text"
                className="form-control"
                id="product_code"
                name="product_code"
                value={currentProduct.product_code}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category_id">Category id</label>
              <input
                type="text"
                className="form-control"
                id="category_id"
                name="category_id"
                value={currentProduct.category_id}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={currentProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={currentProduct.stock}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentProduct.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentProduct.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={deleteProduct}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateProduct}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Product...</p>
        </div>
      )}
    </div>
  );
};

export default Product;
