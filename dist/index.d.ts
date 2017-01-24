export declare class Container {
    private modules;
    bind<T>(module: T, name: string): void;
    resolve<T>(module: string | Constructable<T> | Factory<T>): Promise<T>;
}
declare type Constructable<T> = {
    new (...args: any[]): T;
};
declare type Factory<T> = {
    (...args: any[]): T | Promise<T>;
};
export {};
