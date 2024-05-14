import React from "react";

import HashLoader from 'react-spinners/HashLoader';

const LoadingScreen = () => {
  return <HashLoader color="#36d7b7" size={100} style={
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  } />
};

export default LoadingScreen;
