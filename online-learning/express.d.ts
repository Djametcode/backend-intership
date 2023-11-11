export { }

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                email: string;
            }
            admin: {
                adminId: string;
                email: string;
            }
        }
    }
}