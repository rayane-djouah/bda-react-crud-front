import React, { useState } from "react";
import ProductDataService from "../../services/ProductsService";

const AddProduct = () => {
  const initialProductState = {
    id: null,
    NAME: "",
    description: "",
    published: false,
  };
  const [Product, setProduct] = useState(initialProductState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...Product, [name]: value });
  };

  const saveProduct = () => {
    var data = {
      NAME: Product.NAME,
      description: Product.description,
    };

    ProductDataService.create(data)
      .then((response) => {
        setProduct({
          id: response.data.id,
          NAME: response.data.NAME,
          description: response.data.description,
          published: response.data.published,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newProduct = () => {
    setProduct(initialProductState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newProduct}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="NAME">NAME</label>
            <input
              type="text"
              className="form-control"
              id="NAME"
              required
              value={Product.NAME}
              onChange={handleInputChange}
              name="NAME"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={Product.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <button onClick={saveProduct} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
