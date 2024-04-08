import fastify from "fastify";

import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { errorHandler } from "./error-handler";
import { checkIn } from "./http/routes/check-in/check-in";
import { createEvent } from "./http/routes/create-event/create-event";
import { getAttendeeBadge } from "./http/routes/get-attendee-badge/get-attendee-badge";
import { getEventAttendees } from "./http/routes/get-event-attendees/get-event-attendees";
import { getEvent } from "./http/routes/get-event/get-event";
import { registerForEvent } from "./http/routes/register-for-event/register-for-event";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: process.env.NODE_ENV === "production" ? process.env.APP_URL : "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Ari API",
      description:
        "API specifications for the back-end of the Ari application.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(checkIn);
app.register(createEvent);
app.register(getAttendeeBadge);
app.register(getEvent);
app.register(getEventAttendees);
app.register(registerForEvent);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
