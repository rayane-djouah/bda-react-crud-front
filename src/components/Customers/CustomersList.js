import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomerDataService from "../../services/CustomersService";
import { useTable } from "react-table";

const CustomersList = (props) => {
  const [Customers, setCustomers] = useState([]);
  const [searchNAME, setSearchNAME] = useState("");
  const CustomersRef = useRef();

  CustomersRef.current = Customers;

  useEffect(() => {
    retrieveCustomers();
  }, []);

  const onChangeSearchNAME = (e) => {
    const searchNAME = e.target.value;
    setSearchNAME(searchNAME);
  };

  const retrieveCustomers = () => {
    CustomerDataService.getAll()
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setCustomers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveCustomers();
  };

  const removeAllCustomers = () => {
    CustomerDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    CustomerDataService.findByName(searchNAME)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openCustomer = (rowIndex) => {
    const id = CustomersRef.current[rowIndex].id;

    props.history.push("/Customers/" + id);
  };

  const deleteCustomer = (rowIndex) => {
    const id = CustomersRef.current[rowIndex].id;

    CustomerDataService.remove(id)
      .then((response) => {
        props.history.push("/Customers");

        let newCustomers = [...CustomersRef.current];
        newCustomers.splice(rowIndex, 1);

        setCustomers(newCustomers);
      })
      .catch((e) => {
        console.log(e);
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
        Header: "Status",
        accessor: "published",
        Cell: (props) => {
          return props.value ? "Published" : "Pending";
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openCustomer(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteCustomer(rowIdx)}>
                <i className="fas fa-trash action"></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: Customers,
    });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by NAME"
            value={searchNAME}
            onChange={onChangeSearchNAME}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
      </div>
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
        <button className="btn btn-sm btn-danger" onClick={removeAllCustomers}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default CustomersList;
