import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Card,CardHeader,CardContent} from './card.jsx';
import {Button} from './button.jsx';
import { Alert, AlertDescription } from './alert.jsx';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/analysis');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadCsv = () => {
    window.location.href = 'http://localhost:5000/analyze';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Housing Data Analysis Dashboard</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button onClick={fetchData} disabled={loading} className="mb-4">
        {loading ? 'Loading...' : 'Refresh Data'}
      </Button>
      
      <Button onClick={downloadCsv} className="ml-2 mb-4">
        Download CSV
      </Button>
      
      <Card className="mb-4">
        <CardHeader>Monthly Increase by Region</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Increase" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>Raw Data</CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Region</th>
                  <th className="px-4 py-2">Increase (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="px-4 py-2">{item.Month}</td>
                    <td className="px-4 py-2">{item.Region}</td>
                    <td className="px-4 py-2">{item.Increase.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;