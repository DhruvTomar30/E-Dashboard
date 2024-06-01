import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      let result = await fetchWithAuth(`http://localhost:5000/product/${params.id}`, {
        method: "GET",
      });
      const data = await result.json();
      setName(data.name);
      setPrice(data.price);
      setCompany(data.company);
      setCategory(data.category);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async () => {
    try {
      let result = await fetchWithAuth(`http://localhost:5000/product/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, category, company }),
      });
      result = await result.json();
      navigate('/');
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
    <div className="flex justify-center items-center p-8 bg-gray-100 pt-32">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Product</h1>
        <div className="space-y-4 flex flex-col">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Product Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Product Price"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter Product Category"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter Product Company"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={updateProduct}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
