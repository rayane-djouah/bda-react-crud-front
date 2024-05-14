import React, { useState, useEffect, useMemo, useRef } from "react";
import ProductDataService from "../../services/ProductsService";
import { useTable } from "react-table";

const ProductsList = (props) => {
  const [Products, setProducts] = useState([]);
  const [searchNAME, setSearchNAME] = useState("");
  const ProductsRef = useRef();

  ProductsRef.current = Products;

  useEffect(() => {
    retrieveProducts();
  }, []);

  const onChangeSearchNAME = (e) => {
    const searchNAME = e.target.value;
    setSearchNAME(searchNAME);
  };

  const retrieveProducts = () => {
    ProductDataService.getAll()
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveProducts();
  };

  const removeAllProducts = () => {
    ProductDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    ProductDataService.findByName(searchNAME)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openProduct = (rowIndex) => {
    const id = ProductsRef.current[rowIndex].id;

    props.history.push("/Products/" + id);
  };

  const deleteProduct = (rowIndex) => {
    const id = ProductsRef.current[rowIndex].id;

    ProductDataService.remove(id)
      .then((response) => {
        props.history.push("/Products");

        let newProducts = [...ProductsRef.current];
        newProducts.splice(rowIndex, 1);

        setProducts(newProducts);
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
              <span onClick={() => openProduct(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteProduct(rowIdx)}>
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
      data: Products,
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
                  <th {...column.getHeaderProps()}>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllProducts}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
