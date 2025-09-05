import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loggedInEmail, setLoggedInEmail] = useState("");
    const [relatedUsers, setRelatedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // for general errors
    const [loginMessage, setLoginMessage] = useState(""); // for token expired
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const access_token = Cookies.get("access_token");
                const email = Cookies.get("emailId"); // assuming you stored user email in cookie at login
                setLoggedInEmail(email);

                const response = await fetch("http://127.2.2.2:9090/getAllPosts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ access_token }),
                });

                const data = await response.json();
                console.log('data', data);

                if (response.ok) {
                    console.log('dataaaaaaaa', data);

                    setPosts(data.postDetails);
                } else {
                    if (data.error && data.error.includes("Token Expired")) {
                        setLoginMessage("Please login again.");
                        setPosts([]);
                    } else {
                        setErrorMessage(data.message || "Failed to fetch posts");
                        setPosts([]);
                    }
                }
            } catch (err) {
                setErrorMessage("Something went wrong while fetching posts.");

            }
        };

        fetchPosts();
    }, []);

    const handleCardClick = async (post) => {
        try {
            const token = Cookies.get("access_token");

            const body = {
                emailId: loggedInEmail,
                post: post,
                access_token: token,
            };

            console.log("Sending body:", body);

            const response = await fetch("http://127.2.2.2:9090/getPostUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                const usersArr =
                    data.users?.[0]?.usersRelated && data.users[0].usersRelated.length > 0
                        ? data.users[0].usersRelated
                        : []; // empty array if none
                setRelatedUsers(usersArr);
            } else {

                if (data.error && data.error.includes("Token Expired")) {
                    setLoginMessage("Please login again.");
                    setPosts([]);
                } else {
                    setErrorMessage(data.message || "Failed to fetch related users");
                    setPosts([]);
                }
                setRelatedUsers([]); // clear users if error
            }
        } catch (err) {
            setErrorMessage("Something went wrong while fetching related users.");
            setRelatedUsers([]);
        }
    };

    return (
        <div>

            {loginMessage && (
                <p style={{ color: "red", fontWeight: "bold" }}>{loginMessage}</p>
            )}

            {errorMessage && !loginMessage && (
                <p style={{ color: "orange", fontWeight: "bold" }}>{errorMessage}</p>
            )}


            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {posts.map((p, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(p.post)}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "8px",
                            width: "250px",
                            cursor: "pointer",
                            transition: "0.2s",
                        }}
                    >
                        <p>{p.post}</p>
                    </div>
                ))}
            </div>

            {relatedUsers !== null && !loginMessage &&

                (relatedUsers.length > 0 ? (
                    <div style={{ marginTop: "20px" }}>
                        <h3>Related Users</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {relatedUsers.map((u, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: "1px solid #007bff",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        width: "220px",
                                        background: "#e9f3ff",
                                    }}
                                >
                                    <p>
                                        <strong>{u.userName}</strong>
                                    </p>
                                    <p>{u.emailId}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p style={{ color: "red" }}>
                        No users associated with this post.
                    </p>
                ))
            }


        </div>
    );
};

export default Posts;






