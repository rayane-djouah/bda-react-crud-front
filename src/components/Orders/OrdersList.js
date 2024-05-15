import React, { useState, useEffect, useMemo, useRef } from "react";
import OrderDataService from "../../services/OrdersService";
import { useTable } from "react-table";

const OrdersList = (props) => {
  const [Orders, setOrders] = useState([]);
  const [searchNAME, setSearchNAME] = useState("");
  const OrdersRef = useRef();

  OrdersRef.current = Orders;

  useEffect(() => {
    retrieveOrders();
  }, []);

  const onChangeSearchNAME = (e) => {
    const searchNAME = e.target.value;
    setSearchNAME(searchNAME);
  };

  const retrieveOrders = () => {
    OrderDataService.getAll()
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setOrders(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveOrders();
  };

  const removeAllOrders = () => {
    OrderDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByNAME = () => {
    OrderDataService.findByNAME(searchNAME)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openOrder = (rowIndex) => {
    const id = OrdersRef.current[rowIndex].id;

    props.history.push("/Orders/" + id);
  };

  const deleteOrder = (rowIndex) => {
    const id = OrdersRef.current[rowIndex].id;

    OrderDataService.remove(id)
      .then((response) => {
        props.history.push("/Orders");

        let newOrders = [...OrdersRef.current];
        newOrders.splice(rowIndex, 1);

        setOrders(newOrders);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "NAME",
        accessor: "NAME",
      },
      {
        Header: "Description",
        accessor: "description",
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
              <span onClick={() => openOrder(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteOrder(rowIdx)}>
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
      data: Orders,
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
              onClick={findByNAME}
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
        <button className="btn btn-sm btn-danger" onClick={removeAllOrders}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
