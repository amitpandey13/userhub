const BASE_URL = "http://localhost:8080/api/auth";

export async function forgotPassword(email) {

    const response = await fetch(`${BASE_URL}/forgot-password`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email
        })

    });

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error);
    }

    return await response.text();

}

export async function verifyOtp(email, otp) {

    const response = await fetch(`${BASE_URL}/verify-otp`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            otp
        })

    });

    if (!response.ok) {

        throw new Error(await response.text());
    }

    return await response.text();

}

export async function resetPassword(email, otp, newPassword) {

    const response = await fetch(`${BASE_URL}/reset-password`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            email,
            otp,
            newPassword

        })

    });

    if (!response.ok) {

        throw new Error(await response.text());
    }

    return await response.text();

}