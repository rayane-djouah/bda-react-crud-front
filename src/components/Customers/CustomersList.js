import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomerDataService from "../../services/CustomersService";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";

const CustomersList = (props) => {
  const navigate = useNavigate();
  const [Customers, setCustomers] = useState([]);
  const CustomersRef = useRef();

  CustomersRef.current = Customers;

  useEffect(() => {
    retrieveCustomers();
  }, []);

  const retrieveCustomers = () => {
    CustomerDataService.getAll()
      .then((response) => {
        console.log(response);
        setCustomers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteCustomer = (CustomerId) => {
    CustomerDataService.remove(CustomerId)
      .then((response) => {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((Customer) => Customer.id !== CustomerId)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "phone",
        accessor: "phone",
      },
      {
        Header: "address",
        accessor: "address",
      },
      {
        Header: "balance",
        accessor: "balance",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <span
              onClick={() => handleDeleteCustomer(row.original.id)}
              style={{ marginLeft: "8px" }}
            >
              <i className="fas fa-trash action"></i>
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: Customers,
    });
  const handleAddCustomer = () => {
    navigate("/customers/add");
  };
  return (
    <div className="list row">
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button
          className="btn btn-sm btn-primary"
          style={{ marginLeft: "8px" }}
          onClick={handleAddCustomer}
        >
          Add Customer
        </button>
      </div>
    </div>
  );
};

export default CustomersList;
