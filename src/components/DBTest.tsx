import { useState, useEffect } from "react";

const DBTest = () => {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/db-test");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRes(JSON.stringify(data, null, 2)); // JSON string olarak göster
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>Hata: {error}</p>;

  return (
    <div>
      <h2 className="text-red-500 bg-amber-300">DB Test Sonucu:</h2>
      <pre>{res}</pre>
    </div>
  );
};

export default DBTest;
