import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import ChatComponent from "./Conversation";
import Chats from "./Chats";
import Contact from "../../sections/dashboard/Contact";
import { useSelector } from "react-redux";

const GeneralApp = () => {
  const theme = useTheme();

  const { sideBar, selectedConversationId } = useSelector((state) => state.app);

  const { directConversations } = useSelector((state) => state.conversation);

  let isDirectTab = false;

  for (let i = 0; i < directConversations.length; ++i) {
    if (directConversations[i].conversationId === selectedConversationId) {
      isDirectTab = true;
      break;
    }
  }

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
          }}
        >
          {isDirectTab ? (
            <ChatComponent />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              {/* <NoChat /> */}
              <Typography variant="subtitle2">
                Select a conversation or start a{" "}
                <Link
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                  to="/"
                >
                  new one
                </Link>
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default GeneralApp;
