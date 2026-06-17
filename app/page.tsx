import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to dashboard — auth middleware handles unauthenticated users
  redirect('/dashboard')
}
