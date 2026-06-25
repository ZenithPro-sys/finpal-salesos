import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'zeenatranderee89@gmail.com'
const ADMIN_PASSWORDS = ['finpal2026', 'Finpal2026!', 'finpal2026!', 'Finpal2026', 'Finpal@2026']
const ADMIN_NAME = 'Zenith Intel'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = (body.password || '').trim()

    const emailMatch = email === ADMIN_EMAIL.toLowerCase()
    const passwordMatch = ADMIN_PASSWORDS.some(
      p => p.toLowerCase() === password.toLowerCase()
    )

    if (emailMatch && passwordMatch) {
      const payload = {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }

      const response = NextResponse.json({
        success: true,
        user: { email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' },
      })

      response.cookies.set('finpal_token', Buffer.from(JSON.stringify(payload)).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}