import React from "react";
import { styled } from "@mui/system";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

const PasswordInput = ({ register, name, error, setPassword }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <StyledInput
        {...register(name, { required: "Password is required" })}
        type={showPassword ? "text" : "password"}
        placeholder="Enter your Password"
        onChange={(e) => setPassword(e.target.value)}
        endAdornment={
          <IconButton
            onClick={togglePasswordVisibility}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
        error={!!error}
      />
      {error && <FormHelperText error>❗{error.message}</FormHelperText>}
    </div>
  );
};
const StyledInput = styled(InputBase)(({ theme, error }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: `1.5px solid ${error ? "red" : ""}`,
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      boxShadow: `${theme.palette.primary.main} 0 0 0 1.5px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default PasswordInput;
