type User = {
  id: string; // same as socket.id or a UUID
  username: string;
  isHost: boolean;
  expiry?: number; // optional, to track which room they're in
  points?: number; // future use
};

export default User;