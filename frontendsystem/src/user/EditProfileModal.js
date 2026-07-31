import { useEffect, useState } from "react";
import { updateCurrentUser } from "../services/userservice";
import { toast } from "react-toastify";
import "../UserCss/editProfileModal.css";

function EditProfileModal({ user, onClose, onUpdate }) {

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        city: "",
        country: "",
        dateOfBirth: "",
        gender: "",
        bio: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (user) {

            setFormData({

                name: user.name || "",

                phoneNumber: user.phoneNumber || "",

                address: user.address || "",

                city: user.city || "",

                country: user.country || "",

                dateOfBirth: user.dateOfBirth || "",

                gender: user.gender || "",

                bio: user.bio || ""

            });

        }

    }, [user]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const updatedUser =
                await updateCurrentUser(formData);

            toast.success("Profile updated successfully.");

            onUpdate(updatedUser);

            onClose();

        } catch (error) {

            toast.error(
                error.message || "Failed to update profile."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="edit-profile-modal">

                <h2>Edit Profile</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Address</label>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="two-column">

                        <div className="form-group">

                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Country</label>

                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="two-column">

                        <div className="form-group">

                            <label>Date of Birth</label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Gender</label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

                                <option value="">Select</option>

                                <option value="Male">Male</option>

                                <option value="Female">Female</option>

                                <option value="Other">Other</option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Bio</label>

                        <textarea
                            rows="4"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditProfileModal;