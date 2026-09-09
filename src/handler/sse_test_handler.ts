import type { RouteHandler } from "fastify"

export const test_sse: RouteHandler = async(req, reply) => {
  reply.sse.keepAlive()

  // Send initial message
  await reply.sse.send({ data: 'Connected' })

  // Check if keepAlive was called
  console.log('Keep alive status:', reply.sse.shouldKeepAlive) // true

  // Set up periodic updates
  const interval = setInterval(async () => {
    if (reply.sse.isConnected) {
      await reply.sse.send({ data: 'ping' })
    } else {
      clearInterval(interval)
    }
  }, 1000)

  reply.sse.onClose(() => {
    clearInterval(interval)
    console.log('Connection closed')
  })
}