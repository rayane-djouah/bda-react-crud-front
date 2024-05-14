import React, { useState, useEffect } from "react";
import ProductDataService from "../../services/ProductsService";

const Product = (props) => {
  const initialProductState = {
    ID: null,
    NAME: "",
    PRICE: "",
    PRODUCT_CODE: "",
    STOCK: 0,
  };
  const [currentProduct, setCurrentProduct] = useState(initialProductState);
  const [message, setMessage] = useState("");

  const getProduct = (ID) => {
    ProductDataService.get(ID)
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
      ID: currentProduct.ID,
      NAME: currentProduct.NAME,
      PRICE: currentProduct.PRICE,
      published: status,
    };

    ProductDataService.update(currentProduct.ID, data)
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
    ProductDataService.update(currentProduct.ID, currentProduct)
      .then((response) => {
        console.log(response.data);
        setMessage("The Product was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteProduct = () => {
    ProductDataService.remove(currentProduct.ID)
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
              <label htmlFor="NAME">NAME</label>
              <input
                type="text"
                className="form-control"
                id="NAME"
                name="NAME"
                value={currentProduct.NAME}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="PRICE">PRICE</label>
              <input
                type="text"
                className="form-control"
                id="PRICE"
                name="PRICE"
                value={currentProduct.PRICE}
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
