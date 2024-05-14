import { Link as RouterLink, Navigate } from "react-router-dom";
// sections
import { Stack, Typography, Link } from "@mui/material";
import AuthSocial from "../../sections/auth/AuthSocial";
import VerifyForm from "../../sections/auth/VerifyForm";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

export default function LoginPage() {

  const { isLoggedIn } = useSelector((state) => state.auth);
  
  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Please Verify OTP</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">
            Sent to email (shreyanshshah242@gmail.com)
          </Typography>
        </Stack>
      </Stack>
      {/* Form */}
      <VerifyForm />
      <AuthSocial />
    </>
  );
}
