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
export interface SavingsGoal {
    id: bigint;
    name: string;
    note?: string;
    createdAt: Time;
    deadline?: Time;
    lastModified: Time;
    targetAmount: number;
    currentAmount: number;
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
    addOrUpdateSavingsGoal(id: bigint | null, name: string, targetAmount: number, currentAmount: number, deadline: Time | null, note: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEntry(id: bigint): Promise<void>;
    deleteSavingsGoal(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboard(): Promise<Dashboard>;
    getEntries(): Promise<Array<Entry>>;
    getSavingsGoals(): Promise<Array<SavingsGoal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
