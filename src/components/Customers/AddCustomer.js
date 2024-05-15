import React, { useState } from "react";
import CustomerDataService from "../../services/CustomersService";

const AddCustomer = () => {
  const initialCustomerState = {
    id: 0,
    name: "",
    phone: "",
    address: "",
    balance: 0,
    published: true,
  };
  const [customer, setCustomer] = useState(initialCustomerState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const saveCustomer = () => {
    var data = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      balance: customer.balance,
      published: customer.published,
    };

    CustomerDataService.create(data)
      .then((response) => {
        setCustomer({
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          address: response.data.address,
          balance: response.data.balance,
          published: response.data.published,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newCustomer = () => {
    setCustomer(initialCustomerState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newCustomer}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={customer.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={customer.phone}
              onChange={handleInputChange}
              name="phone"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={customer.address}
              onChange={handleInputChange}
              name="address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="balance">Balance</label>
            <input
              type="number"
              className="form-control"
              id="balance"
              value={customer.balance}
              onChange={handleInputChange}
              name="balance"
            />
          </div>

          <button onClick={saveCustomer} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
