import { signInSchema } from "@/schemas/signInSchema"


export default async function signInAction(formData:FormData){

    const email = formData.get("email")
    const password = formData.get("password")



    const result = signInSchema.safeParse({
        
    })

}