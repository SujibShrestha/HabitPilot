import { type CorsOptions } from "cors";

const allowedOrigins: (string | RegExp)[] = [
  "http://localhost:3000", // other frontend devs
  "http://127.0.0.1:3000",
  "http://localhost:5173",
].filter(Boolean) as (string | RegExp)[];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);
    if (!origin) return callback(null, true); // Postman/curl/no-origin

    const isAllowed = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin,
    );

    if (isAllowed) return callback(null, true);

    console.error("Blocked Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // needed if you send cookies or JWT
};

export default corsOptions;