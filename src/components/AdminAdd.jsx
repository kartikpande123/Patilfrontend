import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUpload,
  FaTrash,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaImage,
  FaImages,
  FaPlus,
} from "react-icons/fa";
import API_BASE_URL from "./ApiConfig";

// Ad config
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AdminAdd() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // ===== SCROLL TO TOP ON MOUNT =====
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Fetch ads on mount
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setIsFetching(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/ads`);
      if (!res.ok) throw new Error("Failed to fetch ads");
      const data = await res.json();
      if (data.success) {
        const arr = Object.keys(data.data).map((key) => ({
          id: key,
          ...data.data[key],
        }));
        // Sort newest first
        arr.sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        });
        setAds(arr);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load advertisements");
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size should be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset the hidden file input
    const el = document.getElementById("ad-image-input");
    if (el) el.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please select a cover advertisement image");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("adImage", selectedImage);

      const res = await fetch(`${API_BASE_URL}/api/ads`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload ad");
      }

      setSuccess("Cover advertisement added successfully!");
      handleRemoveImage();

      // Refresh list
      await fetchAds();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while uploading");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?"))
      return;

    setIsDeleting(adId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/ads/${adId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete ad");
      }

      setSuccess("Advertisement deleted successfully!");
      await fetchAds();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete advertisement");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 100%)",
          padding: "18px 30px",
          margin: "-20px -20px 30px -20px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          boxShadow: "0 4px 20px rgba(10, 22, 40, 0.15)",
        }}
      >
        <button
          onClick={() => navigate("/admindashboard")}
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#FFFFFF",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 212, 255, 0.15)";
            e.currentTarget.style.borderColor = "#00D4FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
        >
          <FaArrowLeft /> Back
        </button>
        <div
          style={{
            width: "1px",
            height: "28px",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />
        <h2
          style={{
            color: "#FFFFFF",
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "0.3px",
          }}
        >
          Manage Cover Advertisements
        </h2>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Info banner */}
        <div
          style={{
            backgroundColor: "rgba(0, 153, 204, 0.08)",
            border: "1px solid rgba(0, 153, 204, 0.25)",
            borderRadius: "12px",
            padding: "14px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaImages
            style={{ color: "#0099CC", fontSize: "18px", flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#0F172A",
              lineHeight: "1.5",
            }}
          >
            Max size <strong>5MB</strong> per image.
          </p>
        </div>

        {/* Upload Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow: "0 4px 25px rgba(15, 23, 42, 0.06)",
            border: "1.5px solid #E2E8F0",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              fontSize: "15px",
              fontWeight: "700",
              color: "#0F172A",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingBottom: "12px",
              borderBottom: "2px solid #F1F5F9",
            }}
          >
            <FaPlus style={{ color: "#0099CC", fontSize: "13px" }} />
            Add New Advertisement
          </h3>

          <form onSubmit={handleSubmit}>
            {!imagePreview ? (
              <div
                onClick={() => {
                  if (!isLoading)
                    document.getElementById("ad-image-input").click();
                }}
                style={{
                  border: "2px dashed #CBD5E1",
                  borderRadius: "14px",
                  padding: "50px 20px",
                  textAlign: "center",
                  backgroundColor: "#F8FAFC",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = "#0099CC";
                    e.currentTarget.style.backgroundColor = "#F0FDFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = "#CBD5E1";
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 153, 204, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    color: "#0099CC",
                    fontSize: "26px",
                  }}
                >
                  <FaUpload />
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#334155",
                    margin: 0,
                    fontWeight: "700",
                  }}
                >
                  Click to upload cover image
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    margin: "6px 0 0",
                  }}
                >
                  PNG, JPG, JPEG • Max 5MB
                </p>
              </div>
            ) : (
              <div
                style={{
                  border: "2px solid #0099CC",
                  borderRadius: "14px",
                  padding: "16px",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Ad preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      minWidth: "140px",
                      backgroundColor: "#FEF2F2",
                      color: "#B91C1C",
                      border: "1.5px solid #FECACA",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#B91C1C";
                        e.currentTarget.style.color = "#FFFFFF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = "#FEF2F2";
                        e.currentTarget.style.color = "#B91C1C";
                      }
                    }}
                  >
                    <FaTrash size={11} /> Remove
                  </button>
                </div>
              </div>
            )}

            <input
              id="ad-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isLoading}
              style={{ display: "none" }}
            />

            {/* Error */}
            {error && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  color: "#B91C1C",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginTop: "16px",
                  border: "1.5px solid #FECACA",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaExclamationCircle />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                style={{
                  backgroundColor: "#F0FDF4",
                  color: "#166534",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginTop: "16px",
                  border: "1.5px solid #BBF7D0",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaCheckCircle />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !selectedImage}
              style={{
                width: "100%",
                marginTop: "20px",
                background:
                  isLoading || !selectedImage
                    ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)"
                    : "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
                color: isLoading || !selectedImage ? "#FFFFFF" : "#0A1628",
                border: "none",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: "800",
                fontSize: "15px",
                cursor: isLoading || !selectedImage ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow:
                  isLoading || !selectedImage
                    ? "none"
                    : "0 6px 20px rgba(0, 212, 255, 0.3)",
                transition: "all 0.3s ease",
                letterSpacing: "0.3px",
              }}
            >
              {isLoading ? (
                <>
                  <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                  Uploading...
                </>
              ) : (
                <>
                  <FaSave /> Save Advertisement
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Ads List */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 25px rgba(15, 23, 42, 0.06)",
            border: "1.5px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "12px",
              borderBottom: "2px solid #F1F5F9",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "700",
                color: "#0F172A",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaImages style={{ color: "#0099CC", fontSize: "13px" }} />
              Existing Advertisements
            </h3>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#007A99",
                backgroundColor: "rgba(0, 153, 204, 0.08)",
                padding: "4px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(0, 153, 204, 0.25)",
              }}
            >
              {ads.length} {ads.length === 1 ? "ad" : "ads"}
            </span>
          </div>

          {isFetching ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <FaSpinner
                style={{
                  fontSize: "32px",
                  color: "#0099CC",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p
                style={{
                  color: "#64748B",
                  marginTop: "12px",
                  fontWeight: "600",
                }}
              >
                Loading...
              </p>
            </div>
          ) : ads.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#94A3B8",
              }}
            >
              <FaImage style={{ fontSize: "36px", color: "#CBD5E1" }} />
              <p
                style={{
                  fontSize: "14px",
                  margin: "10px 0 0",
                  fontWeight: "600",
                }}
              >
                No advertisements yet
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  style={{
                    border: "1.5px solid #E2E8F0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#F8FAFC",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0099CC";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0, 153, 204, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "140px",
                      backgroundColor: "#FFFFFF",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={ad.imageUrl}
                      alt="Ad"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => handleDelete(ad.id)}
                      disabled={isDeleting === ad.id}
                      title="Delete ad"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(254, 226, 226, 0.95)",
                        color: "#B91C1C",
                        border: "1px solid #FECACA",
                        cursor:
                          isDeleting === ad.id ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (isDeleting !== ad.id) {
                          e.currentTarget.style.backgroundColor = "#B91C1C";
                          e.currentTarget.style.color = "#FFFFFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isDeleting !== ad.id) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(254, 226, 226, 0.95)";
                          e.currentTarget.style.color = "#B91C1C";
                        }
                      }}
                    >
                      {isDeleting === ad.id ? (
                        <FaSpinner
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "#64748B",
                        fontWeight: "600",
                      }}
                    >
                      {ad.createdAt
                        ? new Date(ad.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
