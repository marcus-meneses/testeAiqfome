export interface AdapterInterface<T> {
    name(): string;
    create(item: T): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: string, item: T): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    findByField(field: string, value: string): Promise<T | null>;
    findByFields(fields: Record<string, any>): Promise<T | null>;
    query(query: Record<string, any>): Promise<T[]>;
}