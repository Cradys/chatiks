import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import amqp from 'amqplib'
import { Config } from '../config.js';


declare module 'fastify' {
  interface FastifyInstance {
    rbbt_conn: amqp.ChannelModel;
  }
}

async function rabbitMQPlugin(fastify: FastifyInstance, config: Config.RabbitMQConfig) {

  const connection = await amqp.connect(config.rabbit_url)
  const channel = await connection.createChannel()
  await channel.assertExchange('messages', 'direct', { durable: true })
  await channel.close()
  
  fastify.decorate('rbbt_conn', connection)

}

export default fp(rabbitMQPlugin, {name: 'rabbitMQ'})