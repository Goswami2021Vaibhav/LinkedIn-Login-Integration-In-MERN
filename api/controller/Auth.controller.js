import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
const getAccessToken = async (code) => {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/linkedin/callback',
    })
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'post',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const accessToken = await response.json()
    return accessToken
}


const getUserData = async (accessToken) => {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    const userData = await response.json()
    return userData
}

export const linkedInCallback = async (req, res) => {
    try {
        const { code } = req.query

        // get access token 
        const accessToken = await getAccessToken(code)

        // get user data using access token 

        const userData = await getUserData(accessToken.access_token)

        if (!userData) {
            return res.status(500).json({
                success: false,
                error
            })
        }

        // check if user registered 
        let user

        user = await User.findOne({ email: userData.email })

        if (!user) {
            user = new User({
                name: userData.name,
                email: userData.email,
                phone: userData?.phone,
                avatar: userData?.picture
            })
            await user.save()
        }


        const token = jwt.sign({ name: user.name, email: user.email, avatar: user.avatar }, process.env.JWT_SECRET)

        res.cookie('token', token,
            {
                httpOnly: true
            }
        )

        res.redirect('http://localhost:5173/profile')

    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}

export const getUser = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        res.status(403).json({
            success: false,
        })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({
        success: true,
        user
    })
}