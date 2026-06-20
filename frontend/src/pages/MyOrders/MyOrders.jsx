import { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            console.log("Fetched Orders:", response.data.data); // Log to confirm structure
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();

            // Set up a timer to refresh orders every minute
            const interval = setInterval(fetchOrders, 2000); // 60000ms = 1 minute
            
            // Clear interval on component unmount
            return () => clearInterval(interval);
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Parcel icon" />
                        <p>
                            {order.items?.map((item, i) => (
                                <span key={i}>
                                    {item.name}→ <span></span>{item.quantity}
                                    {i < order.items.length - 1 ? ' ' : ''}<br></br>
                                </span>
                            ))}
                        </p>
                        <p>₹ {order.amount}</p>
                        <p>Items: {order.items ? order.items.length : 0}</p>
                        <p>
                            <span>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
