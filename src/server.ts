import express from "express";
import config from "@/config";
import { globalErrorHandler } from "@/utils";
import { router } from "@/routes/router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(globalErrorHandler);

app.listen(config.port, () => console.log(`✔ server running on port ${config.port}`));
