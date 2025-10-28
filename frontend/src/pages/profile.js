import { useEffect, useState } from "react";
import { updateProfile } from "../services/api";
import api from "../services/api.js";   
import withAuth from "../components/withAuth";


function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    const getProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await api.getProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    getProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateProfile(profile);
    console.log("Profile updated:", response);

    if (response.success) {
      alert("Profile updated successfully");
    } else {
      alert("Error updating profile");
    }
  };


return (
  <div>
    <h1>Profile Page</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </label>
      </div>
      <button type="submit">Update</button>
    </form>
  </div>
);
}
export default withAuth(Profile);
