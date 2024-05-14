import React, { useState, useEffect } from "react";
import OrderDataService from "../../services/OrdersService";

const Order = (props) => {
  const initialOrderState = {
    ID: null,
    NAME: "",
    PRICE: "",
    Order_CODE: "",
    STOCK: 0,
  };
  const [currentOrder, setCurrentOrder] = useState(initialOrderState);
  const [message, setMessage] = useState("");

  const getOrder = (ID) => {
    OrderDataService.get(ID)
      .then((response) => {
        setCurrentOrder(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getOrder(props.match.params.ID);
  }, [props.match.params.ID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentOrder({ ...currentOrder, [name]: value });
  };

  const updatePublished = (status) => {
    var data = {
      ID: currentOrder.ID,
      NAME: currentOrder.NAME,
      PRICE: currentOrder.PRICE,
      published: status,
    };

    OrderDataService.update(currentOrder.ID, data)
      .then((response) => {
        setCurrentOrder({ ...currentOrder, published: status });
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateOrder = () => {
    OrderDataService.update(currentOrder.ID, currentOrder)
      .then((response) => {
        console.log(response.data);
        setMessage("The Order was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteOrder = () => {
    OrderDataService.remove(currentOrder.ID)
      .then((response) => {
        console.log(response.data);
        props.history.push("/Orders");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentOrder ? (
        <div className="edit-form">
          <h4>Order</h4>
          <form>
            <div className="form-group">
              <label htmlFor="NAME">NAME</label>
              <input
                type="text"
                className="form-control"
                id="NAME"
                name="NAME"
                value={currentOrder.NAME}
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
                value={currentOrder.PRICE}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentOrder.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentOrder.published ? (
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

          <button className="badge badge-danger mr-2" onClick={deleteOrder}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateOrder}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Order...</p>
        </div>
      )}
    </div>
  );
};

export default Order;
