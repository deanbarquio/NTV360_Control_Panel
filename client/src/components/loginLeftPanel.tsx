import React, { useEffect, useState } from "react";
import image1 from "../assets/Hero-Banner-1.webp";
import image2 from "../assets/Hero-Banner-2.jpg";
import image3 from "../assets/Hero-Banner-3.jpg";

const images = [image1, image2, image3];

const LoginLeftPanel = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="w-1/2 bg-blue-900 text-white relative hidden lg:flex flex-col  items-center px-10">
      <img
        src={images[currentImage]}
        alt="NTV30 Team"
        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-500"
      />
      <div className="inset-0 bg-black/50" />
      <div className="z-10 text-left absolute bottom-35">
        <h1 className="text-4xl font-bold mb-4 ">Control Your Broadcast</h1>
        <p className="text-lg opacity-90">Empowering your content delivery with precision and ease.</p>
      </div>
      <div className="absolute bottom-10 z-10 flex gap-2  items-center ">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentImage === index ? "bg-white" : "bg-white opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginLeftPanel;
