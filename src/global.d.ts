declare module 'express-session' {
    interface SessionData {
        userid: string
    }
}
declare namespace NodeJS {
    interface ProcessEnv {
        ADMIN_USERNAME : string
    }
}

export {}
