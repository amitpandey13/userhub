const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/users`;
const ADMIN_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin`;

export const saveUser = async (user) => {
  const response = await fetch(`${BASE_URL}/savedUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Unable to save user");
  }

  return response.json();
};

export const addUserByAdmin = async (user) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${ADMIN_URL}/savedUserByAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Unable to create user");
  }

  return response.json();
};


// export const getAllUsers = async (page, size) => {
  
//   const response = await fetch(
//     `${ADMIN_URL}/getAllUsers?page=${page}&size=${size}`,
//   );
//   if (!response.ok) {
//     throw new Error("Unable to fetch users");
//   }

//   return response.json();
// };

export const getAllUsers = async (page, size, status) => {

    const token = localStorage.getItem("token");

    

    let url = `${ADMIN_URL}/getAllUsers?page=${page}&size=${size}`;

    if (status) {
        url += `&status=${status}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Unable to fetch users");
    }

    return response.json();
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/deleteUser/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to delete user");
  }
};
export const restoreUser = async (userId) => {

    const response = await fetch(
        `${BASE_URL}/restoreUser/${userId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to restore user");
    }
};

export const updateUser = async (userId, user) => {
    console.log(userId);
  const response = await fetch(`${BASE_URL}/updateUser/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Unable to update user");
  }

  return response.json();
};

export const loggedInUserFunction = async (loggedInUser) => {
  console.log(process.env.REACT_APP_API_BASE_URL);
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loggedInUser),
  });

  if (!response.ok) {
        const error = await response.json();
        console.log(error)
        console.log(error.message)
        throw new Error(error.message || "Login failed");
  }

    // Save JWT token
    // console.log("token" +response.token)
   
    
  return response.json();
};



export const logout = async () => {

    const token = localStorage.getItem("token");

    try {

        await fetch(`${BASE_URL}/logout`, {

            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

    } catch (e) {
        console.log(e);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
};




export const searchUsers = async (keyword) => {

    const response = await fetch(
        `${ADMIN_URL}/search?keyword=${encodeURIComponent(keyword)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search users");
    }

    return await response.json();
};

export const importExcel = async (file) => {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${BASE_URL}/import`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Import failed");
    }

    return response.json();
};

export const getCurrentUser = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/profile`, {

        method: "GET",

        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }

    });

    if (!response.ok) {

        throw new Error("Failed to fetch profile");

    }

    return await response.json();
};

export const updateCurrentUser = async (user) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/profile`,
        {
            method: "PUT",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    if (!response.ok) {

        throw new Error("Unable to update profile");

    }

    return await response.json();
};

export const changePassword = async (passwordData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/change-password`,
        {
            method: "PUT",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(passwordData)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

};

export const uploadProfilePicture = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${BASE_URL}/profile-picture`,
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            },

            body: formData
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.message || "Upload failed."
        );
    }

    return await response.json();
};

export const deleteProfilePicture = async () => {

    const response = await fetch(
        `${BASE_URL}/profile-picture`,
        {
            method: "DELETE",

            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.message || "Failed to delete profile picture."
        );
    }

    return await response.json();
};

export const getNotifications = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/notifications`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch notifications.");
    }

    return await response.json();
};

export const markNotificationAsRead = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/notifications/${id}/read`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark notification as read.");
    }

    return await response.json();
};

export const markAllNotificationsRead = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/notifications/read-all`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark all notifications as read.");
    }
};

export const deleteNotification = async (id) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/notifications/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete notification.");
    }
};



export const sendNotification = async (request) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${ADMIN_URL}/notifications`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error || "Failed to send notification.");

    }

    return await response.json();

};

export const broadcastNotification = async (request) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${ADMIN_URL}/notifications/broadcast`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {

        throw new Error(await response.text());

    }

    return await response.text();

};