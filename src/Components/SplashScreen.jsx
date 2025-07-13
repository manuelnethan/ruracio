import React, { useEffect } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <h1 className="fade-in-text calligraphy-text">C & D</h1>

    </div>
  );
}
