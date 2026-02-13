import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Story {
    id: bigint;
    title: string;
    content: string;
}
export interface backendInterface {
    addStory(title: string, content: string): Promise<void>;
    getAllStories(): Promise<Array<Story>>;
    getStory(id: bigint): Promise<Story | null>;
}
