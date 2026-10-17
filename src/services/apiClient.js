import axios from 'axios'

// Ready for the future REST API. Configure the base URL in .env (see .env.example).
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})
