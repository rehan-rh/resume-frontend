import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent, Typography, CircularProgress, Button } from "@mui/material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [lastResume, setLastResume] = useState(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProfile = async () => {
          const token = Cookies.get("token");   // Get token for authentication
          if (!token) {
            console.error("token is missing.");
            setLoading(false);
            return;
          }
      
          try {
            const response = await axios.get("http://localhost:7777/user/profile", {
              headers: {
                Authorization: `Bearer ${token}`, // Pass token correctly
              },
            });
      
            console.log("API Response:", response.data);
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
      

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* User Profile Card */}
      {/* <p className="mt-16">Tharun</p> */}
      <Card className="shadow-md mb-4">
        <CardContent>
          <Typography variant="h5" className="font-bold">Profile Details</Typography>
          <Typography variant="body1">First Name: {user.firstName}</Typography>
          <Typography variant="body1">Last Name: {user.lastName}</Typography>
          <Typography variant="body1">Email: {user.emailId}</Typography>
        </CardContent>
      </Card>

      {/* Last Resume Stats */}
      {lastResume ? (
        <Card className="shadow-md">
          <CardContent>
            <Typography variant="h5" className="font-bold">Last Resume Stats</Typography>
            <Typography variant="body1">Score: {lastResume.score}/100</Typography>
            <Typography variant="body1">Readability: {lastResume.readabilityScore}/100</Typography>
            <Typography variant="body1">
              ATS Friendly: {lastResume.atsFriendly ? "Yes ✅" : "No ❌"}
            </Typography>

            {/* Missing Keywords */}
            {lastResume.missingKeywords.length > 0 && (
              <>
                <Typography variant="subtitle1" className="font-semibold mt-2">Missing Keywords:</Typography>
                <ul className="list-disc ml-4 text-red-500">
                  {lastResume.missingKeywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Grammar Issues */}
            {lastResume.grammarIssues.length > 0 && (
              <>
                <Typography variant="subtitle1" className="font-semibold mt-2">Grammar Issues:</Typography>
                <ul className="list-disc ml-4 text-red-500">
                  {lastResume.grammarIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent>
            <Typography variant="h6" className="font-semibold">No resume uploaded yet</Typography>
          </CardContent>
        </Card>
      )}

      <Button variant="contained" color="primary" className="mt-4">
        Upload New Resume
      </Button>
    </div>
  );
};

export default ProfilePage;