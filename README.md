# Microservice write in Node.js

- Utilizando Kafka;
- Utilizando Node;

## Aplicações

- API principal (Station);
- Geração de certificado;

## Fluxo

- API principal envia uma menssagem pro serviço de certificado para gerar o certificado;
- Micro-serviço de certificado devolve uma resposta (síncrona/assíncrona);

Se conseguir síncrona/assíncrona:

- Receber uma resposta assíncrona de quando o e-mail com o certificado foi enviado;

## O que sabemos ?

- REST (latência);
- Redis / RabbitMQ / **Kafka**;

- Nubank, Uber, Paypal, Netflix;

## O que podemos estudar

- Consumer demorando para subir;
- Framework gráficos para microserviços (Molecular / Nest)
- _expectResponse_ (Algo Assim)
- trocar PhantomJS (por conta de estar depreciado) por puppeteer
