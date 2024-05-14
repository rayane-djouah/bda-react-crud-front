import React, { useState } from "react";
import OrderDataService from "../../services/OrdersService";

const AddOrder = () => {
  const initialOrderState = {
    id: null,
    NAME: "",
    description: "",
    published: false,
  };
  const [Order, setOrder] = useState(initialOrderState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrder({ ...Order, [name]: value });
  };

  const saveOrder = () => {
    var data = {
      NAME: Order.NAME,
      description: Order.description,
    };

    OrderDataService.create(data)
      .then((response) => {
        setOrder({
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

  const newOrder = () => {
    setOrder(initialOrderState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newOrder}>
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
              value={Order.NAME}
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
              value={Order.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <button onClick={saveOrder} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
