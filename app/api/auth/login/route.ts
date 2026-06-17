import { NextRequest, NextResponse } from 'next/server'

// Hardcoded admin user for MVP — replace with DB lookup post-launch
const ADMIN_USER = {
  email: 'zeenatranderee89@gmail.com',
  password: 'finpal2026',
  name: 'Zenith Intel',
  role: 'admin',
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (
      email?.toLowerCase() === ADMIN_USER.email.toLowerCase() &&
      password === ADMIN_USER.password
    ) {
      const response = NextResponse.json({
        success: true,
        user: { email: ADMIN_USER.email, name: ADMIN_USER.name, role: ADMIN_USER.role },
      })

      // Set auth cookie (7 days)
      response.cookies.set('finpal_token', Buffer.from(JSON.stringify({
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
        role: ADMIN_USER.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
