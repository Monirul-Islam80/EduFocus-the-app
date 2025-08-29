import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: null,
  messages: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    clearSelectedChat(state) {
      state.selectedChat = null;
    },
  },
});

export const { setSelectedChat, clearSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
