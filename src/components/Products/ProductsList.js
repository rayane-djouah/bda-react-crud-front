import React, { useState, useEffect, useMemo, useRef } from "react";
import ProductDataService from "../../services/ProductsService";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";

const ProductsList = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const productsRef = useRef();

  productsRef.current = products;

  useEffect(() => {
    retrieveProducts();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const retrieveProducts = () => {
    ProductDataService.getAll()
      .then((response) => {
        console.log(response);
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
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    ProductDataService.findByName(searchName)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openProduct = (rowIndex) => {
    const id = productsRef.current[rowIndex].id;
    navigate("/products/" + id);
  };

  const deleteProduct = (rowIndex) => {
    const id = productsRef.current[rowIndex].id;

    ProductDataService.remove(id)
      .then(() => {
        navigate("/products/");
        setProducts((prevProducts) =>
          prevProducts.filter((product, index) => index !== rowIndex)
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Product Code",
        accessor: "product_code",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Category ID",
        accessor: "category_id",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Stock",
        accessor: "stock",
      },
      {
        Header: "Status",
        accessor: "published",
        Cell: ({ value }) => (value ? "Published" : "Pending"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <span onClick={() => openProduct(row.id)}>
              <i className="far fa-edit action mr-2"></i>
            </span>
            <span onClick={() => deleteProduct(row.id)}>
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
      data: products,
    });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={onChangeSearchName}
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
        <button className="btn btn-sm btn-danger" onClick={removeAllProducts}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
