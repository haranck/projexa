import { Model, Types } from "mongoose";
import { IBaseRepository } from "../../../../../domain/interfaces/repositories/base/IBaseRepository";

export type WithId = {
  _id?: string | Types.ObjectId;
};

export abstract class BaseRepo<T extends WithId> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) { }

  async create(data: T): Promise<string> {
    const doc = await new this.model(data).save();
    return doc._id.toString();
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean<T>();
    return doc ?? null;
  }

  async update(e: Partial<T>, id: string): Promise<T | null> {
    const doc = await this.model.findByIdAndUpdate(id, e, { new: true }).lean<T>();
    return doc ?? null;
  }

  async deleteById(id: string): Promise<T | null> {
    const result = await this.model.findByIdAndDelete(id).lean<T>();
    return result ?? null;
  }
}
