import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserProfile } from "../../redux/slices/app";
import { FetchDirectConversations, FetchGroupConversations } from "../../redux/slices/conversation";
import { socket, connectSocket } from "../../socket";
import {
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
    dispatch(FetchDirectConversations());
    dispatch(FetchGroupConversations());
  }, []);


  useEffect(() => {
    if (isLoggedIn && isVerified) {

      if (!socket) {
        connectSocket(userId);
      }

      socket.on("new_message", (data) => {
        // check if msg we got is from currently selected conversation
        dispatch(
          AddMessage({
            id: data.messageId,
            type: data.type,
            subtype: data.subtype,
            senderId: data.senderId,
            conversationId: data.conversationId,
            createdAt: data.createdAt,
            content: data.content,
            imageUrl: data.imageUrl,
          })
        );
      });
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
