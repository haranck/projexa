export interface IBaseRepository<T> {
  create(data: T): Promise<string>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  update(e: Partial<T>, id: string): Promise<void>;
}