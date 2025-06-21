import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SessionData {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: number;
}

interface WalletDB extends DBSchema {
    session: {
        key: string;
        value: SessionData;
    };
}

class SessionManager {
    private db: IDBPDatabase<WalletDB> | null = null;
    private readonly DB_NAME = 'wallet-db';
    private readonly DB_VERSION = 1;
    private readonly SESSION_KEY = 'current-session';

    async init() {
        if (!this.db) {
            this.db = await openDB<WalletDB>(this.DB_NAME, this.DB_VERSION, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('session')) {
                        db.createObjectStore('session');
                    }
                },
            });
        }
        return this.db;
    }

    async setSession(data: SessionData) {
        const db = await this.init();
        await db.put('session', data, this.SESSION_KEY);
    }

    async getSession(): Promise<SessionData | null> {
        const db = await this.init();
        return db.get('session', this.SESSION_KEY);
    }

    async clearSession() {
        const db = await this.init();
        await db.delete('session', this.SESSION_KEY);
    }

    async isSessionValid(): Promise<boolean> {
        const session = await this.getSession();
        if (!session) return false;
        return session.expiresAt > Date.now();
    }
}

export const sessionManager = new SessionManager(); 