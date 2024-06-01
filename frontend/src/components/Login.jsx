import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        const auth=localStorage.getItem('user');
        if(auth){
          navigate('/');
        }
      },[]);

    const handleLogin=async()=>{
        console.log("email, password",email,password);
        let result=await fetch("http://localhost:5000/login",{
        method: 'post',
        body:JSON.stringify({email,password}),
        headers: {
            'Content-Type': 'application/json',
            },
        });
        result=await result.json();
        console.log(result);
        if(result.auth){
            localStorage.setItem("user",JSON.stringify(result.user));
            localStorage.setItem("token",JSON.stringify(result.auth));
            navigate("/")
        }
        else{
            alert("Invalid Credentials");
        }
    }

  return (
    <div className="flex items-center justify-center bg-gray-100 h-full p-32">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs w-full">
        <input
          type="text" onChange={(e)=>setEmail(e.target.value)} value={email}
          placeholder="Enter email"
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password" onChange={(e)=>setPassword(e.target.value)} value={password}
          placeholder="Enter password"
          className="mb-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleLogin} className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
