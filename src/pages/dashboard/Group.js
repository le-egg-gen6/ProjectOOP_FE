import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { SimpleBarStyle } from "../../components/Scrollbar";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import CreateGroup from "../../sections/dashboard/CreateGroup";
import ChatComponent from "./Conversation";

const Group = () => {

  const dispatch = useDispatch();

  const { groupConversations } = useSelector((state) => state.conversation);

  const { sideBar, selectedConversationId } = useSelector((state) => state.app);

  let isGroupTab = false;

  for (let i = 0; i < groupConversations.length; ++i) {
    if (groupConversations[i].conversationId === selectedConversationId) {
      isGroupTab = true;
      break;
    }
  }

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }
  const handleOpenDialog = () => {
    setOpenDialog(true);
  }
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {/* Left */}

        <Box
          sx={{
            overflowY: "scroll",

            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,

            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
              <Typography variant="subtitle2" sx={{}} component={Link}>
                Create New Group
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
              <SimpleBarStyle timeout={500} clickOnTrack={false}>
                <Stack spacing={2.4}>
                  <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                    Pinned
                  </Typography>
                  {/* Chat List */}
                  {groupConversations.filter((el) => el.pinned).map((el, idx) => {
                    return <ChatElement key={idx} {...el} />;
                  })}
                  <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                    All Chats
                  </Typography>
                  {/* Chat List */}
                  {groupConversations.filter((el) => !el.pinned).map((el, idx) => {
                    return <ChatElement key={idx} {...el} />;
                  })}
                </Stack>
              </SimpleBarStyle>
            </Stack>
          </Stack>
        </Box>

        {/* Right */}
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
          {isGroupTab ? (
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
      {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default Group;
