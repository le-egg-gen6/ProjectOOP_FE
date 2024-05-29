import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import { socket, stompClient, connectSocket } from "../../socket";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
} from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { isLoggedIn, isVerified } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);


  useEffect(() => {
    if (isLoggedIn && isVerified) {

      if (!socket) {
        connectSocket();
      }

      socket.on("new_message", (data) => {
        const message = data.message;
        console.log(current_conversation, data);
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el?.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("start_chat");
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
