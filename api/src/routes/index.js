import { Router } from "express";
import { CompressionTypes } from "kafkajs";

const routes = Router();

routes.post("/certifications", async (req, res) => {
  const { producer } = req;
  // Call Microservice

  const message = {
    user: Math.ceil(Math.random() * Date.now()).toString(32),
    name: "TecladistaProd",
    course: "JavaScript Development",
    startMonth: "02/2019",
    endMonth: "08/2019",
    totalHours: 150,
    grade: 5
  };

  await producer.send({
    topic: "issue-certificate",
    messages: [
      {
        key: "infos",
        value: JSON.stringify(message)
      }
    ],
    compression: CompressionTypes.GZIP
  });

  return res.json({
    ok: true
  });
});

export default routes;
