import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetchWithAuth("https://e-dashboard-xbp7.onrender.com/products");
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    let result = await fetchWithAuth(`https://e-dashboard-xbp7.onrender.com/product/${id}`, {
      method: "DELETE",
    });
    result = await result.json();
    if (result) {
      getProducts();
      setLoading(false);
    }
  };

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetchWithAuth(`https://e-dashboard-xbp7.onrender.com/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let token = JSON.parse(localStorage.getItem("token"));

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      let data = await response.json();
      if (data.message === "Token expired") {
        // Refresh token
        let refreshResponse = await fetch("https://e-dashboard-xbp7.onrender.com/refresh-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (refreshResponse.ok) {
          let refreshData = await refreshResponse.json();
          localStorage.setItem("token", JSON.stringify(refreshData.auth));

          // Retry original request
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${refreshData.auth}`,
            },
          });
        }
      }
    }

    return response;
  };

  return (
    <div className="p-12 md:p-8 lg:p-8 mt-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Product List</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search Product"
          className="md:w-1/3 lg:w-1/3 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          onChange={searchHandle}
        />
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <ul className="min-w-full bg-blue-50 border-b-2 border-blue-200 font-semibold flex justify-between text-center text-xs sm:text-sm md:text-base">
              <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">S. No</li>
              <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">Name</li>
              <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">Price</li>
              <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">Category</li>
              <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">Operation</li>
            </ul>

            {products.length > 0 ? (
              products.map((item, index) => (
                <ul
                  key={index}
                  className="min-w-full border-b border-gray-200 flex justify-between text-center text-xs sm:text-sm md:text-base hover:bg-gray-100"
                >
                  <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4 border-r">{index + 1}</li>
                  <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4 border-r">{item.name}</li>
                  <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4 border-r">{item.price}</li>
                  <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4">{item.category}</li>
                  <li className="py-3 px-2 sm:px-4 w-1/5 sm:w-1/4 flex flex-col sm:flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm md:text-base"
                    >
                      Delete
                    </button>
                    <Link
                      to={"/update/" + item._id}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm md:text-base"
                    >
                      Update
                    </Link>
                  </li>
                </ul>
              ))
            ) : (
              <h1 className="text-bold text-lg flex justify-center p-4">No Result Found</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
