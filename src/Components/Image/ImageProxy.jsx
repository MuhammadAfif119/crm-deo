import { useState, useEffect } from "react";

export default function ImageProxy({ url }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent(url);
    const endpoint = `${proxyUrl}${apiUrl}`;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        if (jsonData && jsonData.contents) {
          setImageUrl(jsonData.contents);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [url]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="proxy" />
      ) : (
        <div>Loading image...</div>
      )}
    </div>
  );
}