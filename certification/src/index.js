import { Kafka } from "kafkajs";
import certificateGen from "./gen";

const kafka = new Kafka({
  brokers: ["kafka:9092"],
  clientId: "certificate"
});

const topic = "issue-certificate";
const consumer = kafka.consumer({
  groupId: "certificate-gen"
});

const producer = kafka.producer();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // const prefix = `${topic}[${partition} | ${message.offset} / ${
      //   message.timestamp
      // }]`;

      // console.log(`- ${prefix} ${message.key}#${message.value}`);

      const payload = JSON.parse(message.value);
      try{
        await certificateGen(
          {
            user_id: payload.user,
            name: payload.name
          },
          {
            name: payload.course,
            startMonth: payload.startMonth,
            endMonth: payload.endMonth,
            totalHours: payload.totalHours
          }
        );
        await producer.send({
          topic: "certification-response",
          messages: [
            {
              value: `Certificate ${payload.user} generated`
            }
          ]
        });
      } catch(err) {
        console.log(err.message)
        console.log(err.stack)
      }
    }
  });
}

setTimeout(run, 7000);
