import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";

import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History, Shared_docs, Shared_links } from "../../data";
import {
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";

const Conversation = ({ menu }) => {
  const dispatch = useDispatch();

  const { directConversations, groupConversations, currentMessages } = useSelector(
    (state) => state.conversation
  );
  const { selectedConversationId, tab } = useSelector((state) => state.app);

  useEffect(() => {
    var current;
    if (tab === 0) {
      current = directConversations.find((el) => el?.conversationId === selectedConversationId);
    } else if (tab === 1) {
      current = groupConversations.find((el) => el?.conversationId === selectedConversationId);
    }

    // socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
    //   // data => list of messages
    //   console.log(data, "List of messages");
    //   dispatch(FetchCurrentMessages({ messages: data }));
    // });

    dispatch(SetCurrentConversation(current));
  }, []);
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {currentMessages.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                // Timeline
                <Timeline el={el} />
              );

            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    // Media Message
                    <MediaMsg el={el} menu={menu} />
                  );

                case "Link":
                  return (
                    //  Link Message
                    <LinkMsg el={el} menu={menu} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg el={el} menu={menu} />
                  );

                default:
                  return (
                    // Text Message
                    <TextMsg el={el} menu={menu} />
                  );
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const theme = useTheme();

  const messageListRef = useRef(null);

  const { currentMessages } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [currentMessages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={"auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <Conversation menu={true} />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
