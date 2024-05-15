import React, { useState, useEffect, useMemo, useRef } from "react";
import ProductDataService from "../../services/ProductsService";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import Product from "./Product";

const ProductsList = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsRef = useRef();

  productsRef.current = products;

  useEffect(() => {
    retrieveProducts();
  }, []);

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

  const openProduct = (rowIndex) => {
    setSelectedProduct(productsRef.current[rowIndex]);
  };

  const handleDeleteProduct = (productId) => {
    ProductDataService.remove(productId)
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        setSelectedProduct(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateProduct = (updatedProduct) => {
    const index = products.findIndex(
      (product) => product.id === updatedProduct.id
    );
    if (index !== -1) {
      const updatedProducts = [...products];
      updatedProducts[index] = updatedProduct;
      setProducts(updatedProducts);
      setSelectedProduct(updatedProduct);
    }
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
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <span onClick={() => openProduct(row.id)}>
              <i className="far fa-edit action mr-2"></i>
            </span>
            <span
              onClick={() => handleDeleteProduct(row.original.id)}
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
      data: products,
    });
  const handleAddProduct = () => {
    navigate("/products/add");
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
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {selectedProduct && (
        <Product
          product={selectedProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default ProductsList;
