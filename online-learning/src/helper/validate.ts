import { z } from 'zod'

const validateZod = z.object({
    MONGO_URL: z.string(),
    EMAIL: z.string().email()
})

export default validateZod
