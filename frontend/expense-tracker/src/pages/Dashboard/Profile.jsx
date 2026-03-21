
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";

const Profile = () => {
  useUserAuth();

  const { user, updateUser } = useContext(UserContext);

  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPreviewUrl(user.profileImageUrl || null);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (profilePic) {
        formData.append("profileImage", profilePic);
      }

      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser(res.data.user);
      toast.success("Profile updated successfully");
      setPreviewUrl(res.data.user.profileImageUrl);
      setProfilePic(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

        <form onSubmit={handleUpdateProfile}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />

          <Input
            value={user?.email || ""}
            label="Email Address"
            type="text"
            placeholder="Email cannot be changed"
            disabled
          />

          <button
            type="submit"
            className="btn-primary mt-4 w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;



