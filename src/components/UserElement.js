import React from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { AcceptFriendRequest, SelectConversation, SendFriendRequest } from "../redux/slices/app";
import { AddDirectConversation } from "../redux/slices/conversation";

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserElement = ({ userId, avatarUrl, fullName, username }) => {
  const dispatch = useDispatch();

  const theme = useTheme();

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt={fullName} src={avatarUrl} />
          </StyledBadge>
          <Stack spacing={0.3}>
            <Typography variant="subtitle1">{fullName}</Typography>
            <Typography variant="body3">{username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              dispatch(SendFriendRequest(userId));
            }}
          >
            Send Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const FriendRequestElement = ({
  requestId,
  senderId,
  avatarUrl,
  fullName,
  username,
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          <Avatar alt={fullName} src={avatarUrl} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{ }</Typography>
          </Stack>
          <Stack spacing={0.3}>
            <Typography variant="subtitle1">{fullName}</Typography>
            <Typography variant="body3">{username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              dispatch(AcceptFriendRequest(requestId, senderId));
            }}
          >
            Accept Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

// FriendElement

const FriendElement = ({
  friendId,
  avatarUrl,
  fullName,
  username,
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { directConversations } = useSelector((state) => state.conversation);

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt={fullName} src={avatarUrl} />
          </StyledBadge>
          <Stack spacing={0.3}>
            <Typography variant="subtitle1">{fullName}</Typography>
            <Typography variant="body3">{username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              for (let i = 0; i < directConversations.length; ++i) {
                const conv = directConversations[i];
                if (conv.participants[0].userId === friendId) {
                  SelectConversation({conversationId: conv.conversationId})
                  return;
                }
              }
              dispatch(AddDirectConversation({friendId: friendId}));
            }}
          >
            <Chat />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { UserElement, FriendRequestElement, FriendElement };
