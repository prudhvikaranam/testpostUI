import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const [emailId, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://127.2.2.2:9090/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emailId, userName }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            Cookies.set("access_token", data.access_token);
            Cookies.set("emailId", emailId);
            setMessage(`✅ Login successful! Welcome ${data.userName}`);

            navigate("/posts");

        } catch (error) {
            setMessage(`❌ ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>User Name</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: 10, marginTop: 10 }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {message && <p style={{ marginTop: 15 }}>{message}</p>}
        </div>
    );
}
