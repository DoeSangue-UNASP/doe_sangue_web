import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

function overpassProxyPlugin(): Plugin {
  return {
    name: 'overpass-proxy',
    configureServer(server) {
      server.middlewares.use('/api/overpass', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { query } = JSON.parse(body) as { query: string }
            const formData = new URLSearchParams()
            formData.append('data', query)

            const response = await fetch('https://overpass-api.de/api/interpreter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'DoeSangueApp/1.0',
              },
              body: formData.toString(),
            })

            const data = await response.json()
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(data))
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Proxy error' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), overpassProxyPlugin()],
})
