import { Event } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { createEvent } from "./create-event";

describe("createEvent", () => {
  let app: FastifyInstance;
  let inMemoryDatabase: Event[] = [];

  beforeEach(() => {
    app = {} as FastifyInstance;
    app.post = jest.fn();
    inMemoryDatabase = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new event", async () => {
    const request = {
      body: {
        title: "New Event",
        details: "Details",
        maximumAttendees: 100,
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createEvent(app);

    expect(app.post).toHaveBeenCalledWith("/events", expect.any(Function));

    const routeHandler = (app.post as jest.Mock).mock.calls[0][1];
    await routeHandler(request, reply);

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should create an event with slug that already exists", async () => {
    const request = {
      body: {
        title: "New Event",
        details: "Details",
        maximumAttendees: 100,
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await createEvent(app);
    expect(app.post).toHaveBeenCalledWith("/events", expect.any(Function));

    const routeHandler = (app.post as jest.Mock).mock.calls[0][1];
    await routeHandler(request, reply);
    
    expect(await createEvent(app)).toThrow()
  });
});
