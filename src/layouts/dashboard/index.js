import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import { FetchConversations } from "../../redux/slices/conversation";
import { socket, connectSocket } from "../../socket";
import {
  UpdateConversation,
  AddConversation,
  AddMessage,
} from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { isLoggedIn, isVerified } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    dispatch(FetchUserProfile());
    dispatch(FetchConversations());
  }, []);


  useEffect(() => {
    if (isLoggedIn && isVerified) {

      if (!socket) {
        connectSocket(userId);
      }

      // socket.on("new_message", (data) => {
      //   // check if msg we got is from currently selected conversation
      //   if (currentConversation?.id === data.conversationId) {
      //     dispatch(
      //       AddMessage({
      //         id: data.id,
      //         type: data.type,
      //         senderId: data.senderId,
      //         content: data.content,
      //         imageUrl: data.imageUrl,
      //       })
      //     );
      //   }
      // });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_message");
    };
  }, [isLoggedIn, isVerified, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  } else {
    if (!isVerified) {
      return <Navigate to={"/verify/account"} />
    }
  }
  
  return (
    <>
      <Stack direction="row">
        <SideNav />

        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;
