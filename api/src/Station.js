import express from "express";
import { Kafka } from "kafkajs";
import routes from "./routes/";

class App {
  constructor() {
    this.server = express();
    this.kafka = new Kafka({
      clientId: "api",
      brokers: ["localhost:9092"],
      retry: {
        initialRetryTime: 200,
        retries: 8
      }
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "certificate-group" });
    this.routes();
  }
  async listen(port, fn) {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: "certification-response" });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const response = message.value.toString();
        console.log("response", response);
      }
    });

    this.server.listen(port, fn);
  }

  routes() {
    // Disponibiliza Producer para todas rotas
    this.server.use((req, res, next) => {
      req.producer = this.producer;
      req.consumer = this.consumer;
      next();
    });

    // Cadastra todas rotas

    this.server.use(routes);
  }
}

export default new App();
