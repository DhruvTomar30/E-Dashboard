import React, { useState } from "react";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);

  const addProducts = async () => {
    if (!name || !price || !category || !company) {
      setError(true);
      return false;
    }

    const userID = JSON.parse(localStorage.getItem("user"))._id;
    try {
      let result = await fetchWithAuth("http://localhost:5000/add-products", {
        method: "POST",
        body: JSON.stringify({ name, price, category, company, userID }),
        headers: { "Content-Type": "application/json" },
      });
      result = await result.json();
      console.log(result);

      // Clear the input fields after adding the product
      setName("");
      setPrice("");
      setCategory("");
      setCompany("");
      setError(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let token = JSON.parse(localStorage.getItem('token'));

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      let data = await response.json();
      if (data.message === "Token expired") {
        // Refresh token
        let refreshResponse = await fetch('http://localhost:5000/refresh-token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (refreshResponse.ok) {
          let refreshData = await refreshResponse.json();
          localStorage.setItem('token', JSON.stringify(refreshData.auth));

          // Retry original request
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${refreshData.auth}`
            }
          });
        }
      }
    }

    return response;
  };

  return (
    <div className="flex justify-center items-center p-10 bg-gray-100 ">
      <div className="bg-white p-8 mt-16 md:mt-16 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        <div className="space-y-4 flex flex-col">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Product Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {error && !name && (
            <span className="text-red-500 text-sm">Enter a Valid name</span>
          )}
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Product Price"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {error && !price && (
            <span className="text-red-500 text-sm">Enter a Valid Price</span>
          )}
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter Product Category"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {error && !category && (
            <span className="text-red-500 text-sm">Enter a Valid Category</span>
          )}
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter Product Company"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {error && !company && (
            <span className="text-red-500 text-sm">Enter a Valid company</span>
          )}
          <button
            onClick={addProducts}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
