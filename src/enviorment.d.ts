declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            botId: string;
            guildId: string;
            enviorment: "dev" | "prod" | "debug";
        }
    }
}

export {};