import { Schema, model, Document } from "mongoose";

interface ITraffic extends Document {
  timestamp: Date;
}

const trafficSchema = new Schema<ITraffic>({
  timestamp: { type: Date, default: Date.now },
});

const Traffic = model<ITraffic>("Traffic", trafficSchema, "Traffic");

export default Traffic;
