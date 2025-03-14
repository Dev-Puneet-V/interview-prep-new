import React, { useState } from "react";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../store/users/usersApi";

const UsersContainer = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [isAddingUser, setIsAddingUser] = useState(false);

  // RTK Query hooks
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const { data: selectedUser, isLoading: isLoadingUser } = useGetUserByIdQuery(
    selectedUserId,
    { skip: !selectedUserId }
  );

  const [addUser, { isLoading: isAddingUserMutation }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      try {
        await addUser(newUser).unwrap();
        setNewUser({ name: "", email: "" });
        setIsAddingUser(false);
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await updateUser({
          id: selectedUser.id,
          name: `${selectedUser.name} (Updated)`,
        }).unwrap();
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();
      if (selectedUserId === id) {
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (usersError) {
    return (
      <div className="alert alert-error">
        Error: {usersError.message || "Failed to fetch users"}
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">RTK Query Example: Users</h2>

      <div className="explanation">
        <p>This example demonstrates RTK Query for data fetching:</p>
        <ul>
          <li>Automatic fetching and caching</li>
          <li>Mutations (add, update, delete)</li>
          <li>Loading and error states</li>
          <li>Cache invalidation</li>
        </ul>
      </div>

      <div className="row" style={{ display: "flex", gap: "20px" }}>
        <div className="col" style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Users List</h3>
            <button
              className="btn btn-primary"
              onClick={() => setIsAddingUser(!isAddingUser)}
            >
              {isAddingUser ? "Cancel" : "Add User"}
            </button>
          </div>

          {isAddingUser && (
            <form
              onSubmit={handleAddUser}
              className="form-group"
              style={{ marginBottom: "20px" }}
            >
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isAddingUserMutation}
              >
                {isAddingUserMutation ? "Adding..." : "Add User"}
              </button>
            </form>
          )}

          {isLoadingUsers ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div>
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSelectUser(user.id)}
                      style={{ marginRight: "5px" }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isDeletingUser}
                    >
                      {isDeletingUser && selectedUserId === user.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-primary"
                onClick={refetchUsers}
                style={{ marginTop: "10px" }}
              >
                Refresh Users
              </button>
            </div>
          )}
        </div>

        <div className="col" style={{ flex: 1 }}>
          <h3>User Details</h3>

          {!selectedUserId ? (
            <div>Select a user to view details</div>
          ) : isLoadingUser ? (
            <div className="loading">Loading user details...</div>
          ) : selectedUser ? (
            <div className="user-card" style={{ flexDirection: "column" }}>
              <h4 className="user-name">{selectedUser.name}</h4>
              <p className="user-email">{selectedUser.email}</p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Website:</strong> {selectedUser.website}
              </p>
              <p>
                <strong>Company:</strong> {selectedUser.company?.name}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${selectedUser.address?.street}, ${selectedUser.address?.city}`}
              </p>

              <button
                className="btn btn-primary"
                onClick={handleUpdateUser}
                disabled={isUpdatingUser}
                style={{ marginTop: "10px" }}
              >
                {isUpdatingUser ? "Updating..." : "Update Name"}
              </button>
            </div>
          ) : (
            <div>User not found</div>
          )}
        </div>
      </div>

      <div className="code-block">
        <pre>{`
// RTK Query example
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => \`users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    // ... other endpoints
  }),
});

// Using the generated hooks in components
const { data: users, isLoading } = useGetUsersQuery();
const [addUser] = useAddUserMutation();
        `}</pre>
      </div>
    </div>
  );
};

export default UsersContainer;
