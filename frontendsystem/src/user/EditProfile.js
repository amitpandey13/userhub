import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getCurrentUser,
    updateCurrentUser
} from '../services/userservice'

import '../UserCss/editProfile.css';

const EditProfile = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        loadUser();

    }, []);

    const loadUser = async () => {

        try {

            const data = await getCurrentUser();

            setUser({
                name: data.name,
                email: data.email
            });

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (event) => {

        const { name, value } = event.target;

        setUser(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            await updateCurrentUser({
                name: user.name
            });

            toast.success("Profile Updated Successfully");

            navigate("/user/dashboard");

        } catch (error) {

            toast.error(error.message);

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="edit-profile-container">

            <form
                className="edit-profile-form"
                onSubmit={handleSubmit}
            >

                <h2>Edit Profile</h2>

                <label>Name</label>

                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                />

                <label>Email</label>

                <input
                    type="email"
                    value={user.email}
                    disabled
                />

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving ? "Updating..." : "Save Changes"}
                </button>

            </form>

        </div>

    );

};

export default EditProfile;