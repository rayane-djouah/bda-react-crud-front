import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductDataService from "../../services/ProductsService";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await ProductDataService.get(id);
        setCurrentProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const updatePublished = (status) => {
    ProductDataService.update(currentProduct.id, {
      ...currentProduct,
      published: status,
    })
      .then((response) => {
        setCurrentProduct({ ...currentProduct, published: status });
        setMessage("The status was updated successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateProduct = () => {
    ProductDataService.update(currentProduct.id, currentProduct)
      .then((response) => {
        setMessage("The Product was updated successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProduct = () => {
    ProductDataService.remove(currentProduct.id)
      .then((response) => {
        navigate("/products/");
      })
      .catch((error) => {
        console.log(error);
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
            {/* Other input fields */}
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
