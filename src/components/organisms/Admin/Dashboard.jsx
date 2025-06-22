import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as BarChartTooltip,
  Tooltip as PieChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import { FaBox, FaDollarSign, FaUsers } from 'react-icons/fa';

import axiosInstance from '@/zustand/instences/axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fetchData = async () => {
    try {
      const productsResponse = await axiosInstance.get('/products/getall');
      const fetchedProducts = productsResponse.data.data.products;

      setProducts(fetchedProducts);
      updateChartData(fetchedProducts, selectedProduct);
      updateInventoryData(fetchedProducts);
      calculateTotalSales(fetchedProducts, selectedProduct);
      setTotalProducts(fetchedProducts.length);

      const usersResponse = await axiosInstance.get('/users/getall');
      const fetchedUsers = usersResponse.data.data;

      setUsers(fetchedUsers);
      setTotalCustomers(fetchedUsers.length);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const updateChartData = (products, productId) => {
    const monthlyData = Array(12).fill(0);

    products.forEach((product) => {
      if (productId === 'all' || product._id === productId) {
        const createdAt = new Date(product.createdAt);
        const month = createdAt.getMonth();
        product.soldPackets = product.soldPackets / 3;
        monthlyData[month] += product.soldPackets || 0;
      }
    });

    const formattedData = monthlyData.map((total, index) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      soldPackets: total,
    }));

    setChartData(formattedData);
  };

  const convertToPackets = (stockQuantity, packetQuantity, unit) => {
    let packets = 0;
    if (unit === 'gram' || unit === 'kg') {
      packets = Math.floor(stockQuantity / packetQuantity);
    }
    return packets;
  };

  const updateInventoryData = (products) => {
    // Calculate packet counts for all products
    let inventory = products.map((product) => {
      const packetCount = convertToPackets(
        product.stockQuantity,
        product.packetQuantity,
        product.stockUnit
      );
      return {
        name: product.name,
        value: packetCount + 2,
        unit: 'packets',
      };
    });

    // Sort by value descending and take top 10
    inventory.sort((a, b) => b.value - a.value);
    const topInventory = inventory.slice(0, 200);

    // Aggregate remaining products into "Others"
    const others = inventory.slice(10).reduce(
      (acc, curr) => ({
        name: 'Others',
        value: acc.value + curr.value,
        unit: 'packets',
      }),
      { name: 'Others', value: 0, unit: 'packets' }
    );

    // Add "Others" if it has value
    if (others.value > 0) {
      topInventory.push(others);
    }

    setInventoryData(topInventory);
  };

  const calculateTotalSales = (products, productId) => {
    let total = 0;
    if (productId === 'all') {
      products.forEach((product) => {
        const soldPackets = product.soldPackets || 0;
        const packetPrice = product.packetPrice || 0;
        total += soldPackets * packetPrice;
      });
    } else {
      const selectedProduct = products.find(
        (product) => product._id === productId
      );
      if (selectedProduct) {
        const soldPackets = selectedProduct.soldPackets || 0;
        const packetPrice = selectedProduct.packetPrice || 0;
        total = soldPackets * packetPrice;
      }
    }
    setTotalSales(total);
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
    updateChartData(products, productId);
    calculateTotalSales(products, productId);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [selectedProduct]);

  const generateColor = (index) => {
    const colors = [
      '#8884d8',
      '#82ca9d',
      '#ff8042',
      '#d0ed57',
      '#ff6f61',
      '#a4de6c',
      '#8e44ad',
      '#f39c12',
      '#e74c3c',
      '#2ecc71',
      '#3498db',
    ];
    return colors[index % colors.length];
  };

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    return (
      <div
        className='max-h-48 overflow-y-auto bg-white p-4 rounded-lg shadow-md border border-gray-200'
        style={{ scrollbarWidth: 'thin' }}
      >
        <ul className='space-y-2'>
          {payload.map((entry, index) => (
            <li
              key={`item-${index}`}
              className='flex items-center space-x-2 text-sm hover:bg-gray-100 p-1 rounded transition-colors duration-200'
            >
              <span
                className='w-4 h-4 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-gray-700'>{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between mb-8'>
        <div className='bg-blue-100 p-6 rounded-lg shadow-md w-1/3 text-center'>
          <FaBox className='text-4xl text-blue-600 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700'>
            Total Products
          </h3>
          <p className='text-2xl font-bold text-blue-600'>{totalProducts}</p>
        </div>
        <div className='bg-green-100 p-6 rounded-lg shadow-md w-1/3 text-center'>
          <FaDollarSign className='text-4xl text-green-600 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700'>
            Total Sales (₹)
          </h3>
          <p className='text-2xl font-bold text-green-600'>₹{totalSales}</p>
        </div>
        <div className='bg-yellow-100 p-6 rounded-lg shadow-md w-1/3 text-center'>
          <FaUsers className='text-4xl text-yellow-600 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700'>
            Total Customers
          </h3>
          <p className='text-2xl font-bold text-yellow-600'>{totalCustomers}</p>
        </div>
      </div>

      <div className='flex justify-between'>
        <div className='w-2/3'>
          <h1 className='text-center text-2xl font-semibold mb-4'>
            Monthly Sales Overview
          </h1>
          {isLoading ? (
            <p className='text-center'>Loading...</p>
          ) : (
            <>
              <div className='mb-6 text-center'>
                <label
                  htmlFor='productSelect'
                  className='mr-2 text-lg text-gray-700'
                >
                  Select Product:
                </label>
                <select
                  id='productSelect'
                  value={selectedProduct}
                  onChange={handleProductChange}
                  className='p-2 border border-gray-300 rounded-lg'
                >
                  <option value='all'>All Products</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <BarChartTooltip />
                  <Bar dataKey='soldPackets' fill='#8884d8' />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        <div className='w-1/3 pl-6'>
          <h2 className='text-center text-xl font-semibold mb-4'>
            Product Inventory
          </h2>
          <ResponsiveContainer width='100%' height={400}>
            <PieChart>
              <Pie
                data={inventoryData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius='80%'
                fill='#82ca9d'
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateColor(index)} />
                ))}
              </Pie>
              <PieChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { name, value, unit } = payload[0].payload;
                    return (
                      <div className='bg-white p-4 border border-gray-300 rounded-lg shadow-sm'>
                        <h4 className='font-semibold'>{name}</h4>
                        <p className='text-sm'>
                          Quantity: {value} {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={<CustomLegend />}
                verticalAlign='top'
                align='center'
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
