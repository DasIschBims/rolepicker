declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            botId: string;
            guildId: string;
            mongodbUri: string;
            enviorment: "dev" | "prod" | "debug";
        }
    }
}

export {};