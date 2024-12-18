import React from 'react'

const Login = () => {
    const handleLogin = () => {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
            redirect_uri: 'http://localhost:3000/api/linkedin/callback',
            scope: 'openid email profile',
        })

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`
    }
    return (
        <div>
            <h1>LinkedIn Login</h1>
            <button onClick={handleLogin}>Sing In With LinkedIn</button>
        </div>
    )
}

export default Login