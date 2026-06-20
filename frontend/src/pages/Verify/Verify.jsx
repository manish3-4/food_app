import React, { useContext, useEffect, useState } from 'react';
import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      
      console.log(response.data); // Debugging output to check API response
      
      if (response.data.success) {
        navigate("/myorders"); // Navigate to /orders if payment is successful
      } else {
        navigate("/"); // Navigate to a different page if payment fails
      }
    } catch (error) {
      console.error("Verification error:", error);
      navigate("/404"); // Navigate to a 404 error page in case of an exception
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  return (
    <div className="verify">
      {loading ? (
        <div className="spinner">Verifying...</div>
      ) : (
        <p>Verification completed. Redirecting...</p>
      )}
    </div>
  );
};

export default Verify;
