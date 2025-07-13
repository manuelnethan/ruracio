import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GuestVerification.css";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";

export default function GuestVerification() {
  const [First_Name, setFirst_Name] = useState("");
  const [Middle_Name, setMiddle_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [canDownload, setCanDownload] = useState(false);
  const [showInputError, setShowInputError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/startup.mp3");
    audioRef.current.play().catch(() => {});

    const timer = setTimeout(() => {
      setShowSplash(false);
      audioRef.current.pause();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!First_Name.trim() || !Middle_Name.trim()) {
      setShowInputError(true);
      return;
    }
    setShowInputError(false);
    setIsSubmitting(true);

    const formData = new URLSearchParams();
    formData.append("First_Name", First_Name);
    formData.append("Middle_Name", Middle_Name);
    formData.append("Last_Name", Last_Name);

    axios.post("https://manuelnethan.pythonanywhere.com/api/verify", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(() => {
        setToastMessage("🎉 Guest added successfully!");
        setShowToast(true);
        setCanDownload(true);
      })
      .catch(() => {
        setToastMessage("❌ Error adding guest. Please try again.");
        setShowToast(true);
        setCanDownload(false);
      })
      .finally(() => setIsSubmitting(false));
  };

  const downloadImageCard = () => {
    const imageUrl = "/img.png"; // replace with your hosted image path
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "Ruracio_Invitation.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {showSplash && (
        <div className="splash-screen d-flex justify-content-center align-items-center">
          <div className="pulse-bg" />
          <div className="fade-in-text display-1 fw-bold">C & D</div>
        </div>
      )}

      {!showSplash && (
        <div className="verification-container d-flex justify-content-center align-items-center p-3">
          {canDownload && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={1000}
              recycle={false}
              gravity={0.2}
              wind={0.01}
            />
          )}

          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
            bg={toastMessage.includes("❌") ? "danger" : "success"}
          >
            <Toast.Body className="text-white fw-semibold">{toastMessage}</Toast.Body>
          </Toast>

          <div className="p-4 rounded shadow-lg glass-card text-white w-100" style={{ maxWidth: "420px" }}>
            <h2 className="text-center mb-4">Ruracio Guest Verification</h2>

            <input
              type="text"
              placeholder="First Name"
              value={First_Name}
              onChange={(e) => setFirst_Name(e.target.value)}
              className="form-control mb-2 input-dark"
              autoFocus
            />

            <input
              type="text"
              placeholder="Middle Name"
              value={Middle_Name}
              onChange={(e) => setMiddle_Name(e.target.value)}
              className="form-control mb-2 input-dark"
            />

            <input
              type="text"
              placeholder="Last Name (optional)"
              value={Last_Name}
              onChange={(e) => setLast_Name(e.target.value)}
              className="form-control mb-3 input-dark"
            />

            {showInputError && (
              <p className="text-warning text-center fw-semibold">
                ⚠️ Please enter both your first and middle name.
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>

            {canDownload && (
              <div className="text-center mt-4">
                <p className="text-success fw-semibold">🎉 Added to the guest list!</p>
                <button
                  onClick={downloadImageCard}
                  className="btn btn-outline-light"
                >
                  Download Your Invitation 🎟️
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
