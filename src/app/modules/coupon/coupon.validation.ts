import z from "zod";

const createCouponZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: "name is required",
        }),
        discount: z.number({
            required_error: "Discount is required",
        }).optional(),
        expiry: z.string({
            required_error: "Expiry is required",
        }),
        custom_code: z.string(),
        max_use: z.number(),
        start_date: z.string().refine((v) => {
            const date = new Date(v);
            return !isNaN(date.getTime());
        }),
        end_date: z.string().refine((v) => {
            const date = new Date(v);
            return !isNaN(date.getTime());
        }),
        status: z.enum(["active", "paused", "inactive"]),
        amount: z.number().optional(),
        type: z.enum(["fixed", "percentage"]),

    }).refine((data) => {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate < endDate;
    }, "Start date must be before end date"),
});


const chackCouponZodSchema = z.object({
    body: z.object({
        code: z.string({
            required_error: "Code is required",
        }),
        amount: z.number({
            required_error: "Amount is required",
        })
    })
});

export const CouponValidation = {
    createCouponZodSchema,
    chackCouponZodSchema
};