import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ProfileCard from "./ProfileCard";

import {
    getCurrentUser,
    uploadProfilePicture
} from '../services/userservice';

function Profile() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {

        try {

            const data = await getCurrentUser();

            setUser(data);

        } catch (error) {

            toast.error("Failed to load profile.");

        }

    };

    const handleProfileUpload = async (file) => {

        try {

            const updatedUser =
                await uploadProfilePicture(file);

            setUser(updatedUser);

            toast.success("Profile picture updated.");

        } catch (error) {

            toast.error(error.message);

        }

    };

    if (!user) {

        return <h2>Loading...</h2>;

    }

    return (

        <ProfileCard
            user={user}
            onUpload={handleProfileUpload}
        />

    );

}

export default Profile;