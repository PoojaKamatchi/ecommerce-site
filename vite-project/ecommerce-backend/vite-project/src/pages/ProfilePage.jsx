import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", pincode: "" },
  });

  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || { street: "", city: "", state: "", pincode: "" },
      });
      if (res.data.location) setLocation(res.data.location);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user:", err);
      setLoading(false);
    }
  };

  // 📍 Get Real-Time Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationAllowed(true);

        try {
          await axios.put(
            "http://localhost:5000/api/users/update-location",
            { lat: latitude, lng: longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchUser();
        } catch (error) {
          console.error("Error updating location:", error);
        }
      },
      (error) => {
        alert("Please allow location access to use this feature.");
        console.error("Location error:", error);
      }
    );
  };

  // 🗑️ Delete Location
  const handleDeleteLocation = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/delete-location",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocation({ lat: null, lng: null });
      setLocationAllowed(false);
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/update-profile",
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <div className="text-center p-5 text-blue-600">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        My Profile
      </h2>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Avatar"
          className="w-36 h-36 rounded-full border-4 border-blue-400 shadow-lg"
        />
      </div>

      {/* Profile Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-gray-700">Name</label>
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-xl p-2 w-full"
            />
          ) : (
            <p className="text-gray-800">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Email</label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Phone</label>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-xl p-2 w-full"
            />
          ) : (
            <p className="text-gray-800">{user.phone || "Not added"}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Address</label>
          {editing ? (
            <>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street"
                className="border rounded-xl p-2 w-full mb-2"
              />
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-xl p-2 w-full mb-2"
              />
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded-xl p-2 w-full mb-2"
              />
              <input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="border rounded-xl p-2 w-full"
              />
            </>
          ) : (
            <p className="text-gray-800">
              {user.address?.street}, {user.address?.city}, {user.address?.state} -{" "}
              {user.address?.pincode}
            </p>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="mt-8 bg-blue-50 p-5 rounded-2xl shadow-inner">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">My Location</h3>

        {location.lat && location.lng ? (
          <>
            <p className="text-gray-700">
              Latitude: <b>{location.lat.toFixed(4)}</b>, Longitude:{" "}
              <b>{location.lng.toFixed(4)}</b>
            </p>
            <iframe
              title="User Location"
              width="100%"
              height="300"
              style={{ borderRadius: "12px", marginTop: "10px" }}
              src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            ></iframe>
            <button
              onClick={handleDeleteLocation}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition"
            >
              Delete Location
            </button>
          </>
        ) : (
          <button
            onClick={handleGetLocation}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Allow & Get My Location
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-5">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
