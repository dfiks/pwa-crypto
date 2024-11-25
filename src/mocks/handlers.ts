import { http, HttpResponse } from 'msw'

// Simulated database
const users = new Map()

export const handlers = [
  http.post('/api/auth/register', async ({ request }) => {
    try {
      const data = await request.json()
      
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return new HttpResponse(
          JSON.stringify({ message: 'Invalid email format' }),
          { status: 400 }
        )
      }

      // Check if email already exists
      if (Array.from(users.values()).some(user => user.email === data.email)) {
        return new HttpResponse(
          JSON.stringify({ message: 'Email already registered' }),
          { status: 409 }
        )
      }

      // Check if username already exists
      if (Array.from(users.values()).some(user => user.username === data.username)) {
        return new HttpResponse(
          JSON.stringify({ message: 'Username already taken' }),
          { status: 409 }
        )
      }

      // Create new user
      const user = {
        id: crypto.randomUUID(),
        email: data.email,
        username: data.username,
        password: data.password // In real app, this should be hashed
      }

      users.set(user.id, user)

      // Generate token (in real app, use proper JWT)
      const token = btoa(JSON.stringify({ id: user.id, email: user.email }))

      return HttpResponse.json({
        id: user.id,
        email: user.email,
        username: user.username,
        token
      })
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid request data' }),
        { status: 400 }
      )
    }
  })
]