import React, { useState, useEffect } from "react";
import CustomerDataService from "../../services/CustomersService";

const Customer = (props) => {
  const initialCustomerState = {
    id: 0,
    name: "",
    phone: "",
    address: "",
    balance: 0,
    published: true,
  };
  const [currentCustomer, setCurrentCustomer] = useState(initialCustomerState);
  const [message, setMessage] = useState("");

  const getCustomer = (id) => {
    CustomerDataService.get(id)
      .then((response) => {
        setCurrentCustomer(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCustomer(props.match.params.ID);
  }, [props.match.params.ID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const updatePublished = (status) => {
    var data = {
      id: currentCustomer.id,
      name: currentCustomer.name,
      phone: currentCustomer.phone,
      address: currentCustomer.address,
      balance: currentCustomer.balance,
    };

    CustomerDataService.update(currentCustomer.id, data)
      .then((response) => {
        setCurrentCustomer({ ...currentCustomer, published: status });
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateCustomer = () => {
    CustomerDataService.update(currentCustomer.id, currentCustomer)
      .then((response) => {
        console.log(response.data);
        setMessage("The Customer was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteCustomer = () => {
    CustomerDataService.remove(currentCustomer.id)
      .then((response) => {
        console.log(response.data);
        props.history.push("/Customers");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentCustomer ? (
        <div className="edit-form">
          <h4>Customer</h4>
          <form>
            <div className="form-group">
              <label htmlFor="id">Customer id</label>
              <input
                type="text"
                className="form-control"
                id="id"
                name="id"
                value={currentCustomer.id}
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
                value={currentCustomer.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={currentCustomer.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={currentCustomer.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="balance">Balance</label>
              <input
                type="number"
                className="form-control"
                id="balance"
                name="balance"
                value={currentCustomer.balance}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentCustomer.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentCustomer.published ? (
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

          <button className="badge badge-danger mr-2" onClick={deleteCustomer}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateCustomer}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Customer...</p>
        </div>
      )}
    </div>
  );
};

export default Customer;
