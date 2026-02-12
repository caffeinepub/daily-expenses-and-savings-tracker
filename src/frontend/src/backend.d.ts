import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CategoryBreakdown {
    total: number;
    category: string;
}
export interface Entry {
    id: bigint;
    entryType: EntryType;
    date: Time;
    note?: string;
    category?: string;
    amount: number;
}
export type Time = bigint;
export interface EntrySummary {
    totalSavings: number;
    totalExpenses: number;
    netBalance: number;
}
export interface Dashboard {
    categoryBreakdown: Array<CategoryBreakdown>;
    summary: EntrySummary;
}
export interface UserProfile {
    name: string;
}
export enum EntryType {
    expense = "expense",
    saving = "saving"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateEntry(id: bigint | null, date: Time, entryType: EntryType, amount: number, category: string | null, note: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEntry(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboard(): Promise<Dashboard>;
    getEntries(): Promise<Array<Entry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
