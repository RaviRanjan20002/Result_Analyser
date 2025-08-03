import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BatchManagement.css";

function BatchManagement() {
  const [batchName, setBatchName] = useState("");
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/batches");
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setMessage("Failed to load batches");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setMessage("Please enter a batch name");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:3001/api/batches/add", {
        name: batchName.trim(),
      });
      setMessage(response.data.message);
      setMessageType("success");
      setBatchName("");
      fetchBatches();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding batch");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="batch-container">
      <div className="header-section">
        <h1 className="main-title">
          <span className="title-icon">📚</span>
          Batch Management
        </h1>
        <p className="subtitle">Organize and manage your Batches</p>
      </div>

      <div className="form-card">
        <h2 className="form-title">Create New Batch</h2>
        <form className="batch-form" onSubmit={handleAddBatch}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter batch name..."
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="batch-input"
              aria-label="Batch Name"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className={`add-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="button-icon">+</span>
                  Add Batch
                </>
              )}
            </button>
          </div>
        </form>

        {message && (
          <div className={`message ${messageType}`}>
            <span className="message-icon">
              {messageType === "success" ? "✅" : "❌"}
            </span>
            {message}
          </div>
        )}
      </div>

      <div className="batches-section">
        <div className="section-header">
          <h2 className="section-title">All Batches</h2>
          <span className="batch-count">{batches.length} batches</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading batches...</p>
          </div>
        ) : (
          <div className="batch-grid">
            {batches.length > 0 ? (
              batches.map((batch, index) => (
                <div key={batch._id} className="batch-card" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="batch-icon">🎓</div>
                  <h3 className="batch-name">{batch.name}</h3>
                  {/* <div className="batch-meta">
                    <span className="batch-id">ID: {batch._id.slice(-6)}</span>
                  </div> */}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No batches yet</h3>
                <p>Create your first batch to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchManagement;
