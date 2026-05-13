import React, { useEffect, useState } from "react";
import { Button, Stack, TextInput } from "@mantine/core";
import Service from "../../utils/http";
import { SHORTEN_URL } from "../../utils/urls";

export const URLShortener = () => {
  const service = new Service();
  const [data, setData] = useState({});
  const [shortUrl, setShortUrl] = useState("");
  const handleSubmit = async () => {
    try {
      const response = await service.post("s", data);
      if (response && response.shortCode) {
        setShortUrl(
          `https://url-shortener-bootcamp.onrender.com/api/s/${response.shortCode}`,
        );
        console.log(`Short URL is ${response.shortCode}`);
      }
    } catch (error) {
      console.log("POST API call failed!", error.message);
    }
  };
  useEffect(() => {
    console.log(`Short URL is ${shortUrl}`);
  }, [shortUrl]);

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <>
      
      {shortUrl ? (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px", marginTop:"50px"}} href={shortUrl} target="_blank" rel="noopener noreferrer">
            Your Short URL: {shortUrl}
            <Button onClick={()=>{
                setShortUrl("");
            }}>Switch back to URL page</Button>
        </div>
      ) : (
        <Stack align="center" justify="center" gap="sm" mt={50}>
            <h1
        className="mantine-focus-auto m_b6d8b162 mantine-Text-root"
        style={{
          "--text-fz": "calc(3.125rem * var(--mantine-scale))",
          "--text-lh": "50px",
          textShadow: "rgba(0, 0, 0, 0.69) 2px 2px 10px",
          fontWeight: "750",
          textAlign: "center",
          padding: "10px",
          margin: "10px",
        }}
      >
        Shorten Your URL Here
      </h1>
          <TextInput
            variant="filled"
            size="md"
            label="Original URL"
            name="originalUrl"
            value={data.originalUrl || ""}
            onChange={handleChange}
            withAsterisk
            placeholder="Paste Original URL"
          />
          <TextInput
            variant="filled"
            size="md"
            label="Customize your link ( Optional )"
            name="customUrl"
            value={data.customUrl || ""}
            onChange={handleChange}
            placeholder="Customize your link "
          />
          <TextInput
            variant="filled"
            size="md"
            label="Title ( Optional )"
            name="title"
            value={data.title || ""}
            onChange={handleChange}
            placeholder="Title of URL"
          />
          <Button onClick={handleSubmit}>Shorten URL</Button>
        </Stack>
      )}
    </>
  );
};
