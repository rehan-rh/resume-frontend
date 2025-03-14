import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent, Typography, CircularProgress, Button, Avatar, Chip, LinearProgress,Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [lastResume, setLastResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:7777/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setLastResume(response.data.lastResume);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditProfile = () =>{
    setOpenEditModal(true);
  }

  const handleSaveProfile = () =>{
    try {
      const token = Cookies.get("token");
      axios.put("http://localhost:7777/user/update-profile", { firstName, lastName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, firstName, lastName });
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-16 mb-16 max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-blue-200">
      {/* Header with Avatar & Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* <Avatar src="/profile-placeholder.png" alt="Profile Picture" className="w-20 h-20" /> */}
          <div>
            <Typography variant="h4" className="font-bold">{user.firstName} Tharun Yetti{user.lastName}</Typography>
            <Typography variant="body1" className="text-gray-600">{user.emailId}</Typography>
          </div>
        </div>
        <Button variant="outlined" startIcon={<Edit />} className="text-blue-500 border-blue-500  hover:bg-blue-300" onClick={handleEditProfile}>Edit Profile</Button>
      </div>

      {/* Resume Stats */}
      {lastResume ? (
        <Card className="shadow-md p-4 mb-4">
          <CardContent>
            <Typography variant="h5" className="font-bold mb-2">Last Resume Stats</Typography>
            <Typography variant="body1">Score: {lastResume.score}/100</Typography>
            <LinearProgress variant="determinate" value={lastResume.score} className="mb-2" />
            <Typography variant="body1">Readability: {lastResume.readabilityScore}/100</Typography>
            <LinearProgress variant="determinate" value={lastResume.readabilityScore} className="mb-2" />
            <Typography variant="body1">ATS Friendly: {lastResume.atsFriendly ? "Yes ✅" : "No ❌"}</Typography>

            {lastResume.missingKeywords.length > 0 && (
              <div className="mt-2">
                <Typography variant="subtitle1" className="font-semibold">Missing Keywords:</Typography>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lastResume.missingKeywords.map((keyword, index) => (
                    <Chip key={index} label={keyword} color="error" />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md p-4">
          <CardContent>
            <Typography variant="h6" className="font-semibold">No resume uploaded yet</Typography>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle variant="h5">Edit Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} margin="normal" />
          <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveProfile} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Upload New Resume Button */}
      <Button variant="contained" color="primary" className="mt-4 w-full" onClick={() => navigate("/analyse")}>
        Upload New Resume
      </Button>
    </div>
  );
};

export default ProfilePage;