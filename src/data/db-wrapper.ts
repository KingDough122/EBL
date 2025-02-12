import { Document } from 'mongoose';

export default abstract class DBWrapper<T1, T2 extends Document> {
    get(identifier: T1) {
        return this.getOrCreate(identifier);
    }
    
    abstract delete(type: T1): Promise<T2>;

    protected abstract async getOrCreate(type: T1): Promise<T2>;
    protected abstract create(type: T1): Promise<T2>;

    save(savedType: T2) {
        return savedType.save();
    }
}
