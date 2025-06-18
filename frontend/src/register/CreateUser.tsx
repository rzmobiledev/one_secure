import { Link } from "@tanstack/react-router"
import {z} from 'zod'
import '../assets/App.css'
import React from "react"
import {useMutation} from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import {registerMutationFn} from "../utils/api"
import { registerSchema } from '../utils/schema'

function CreateUser() {
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)

    const { mutate, isPending } = useMutation({
        mutationFn: registerMutationFn,
    });


    type SchemaProps = z.infer<typeof registerSchema>

    const {register, handleSubmit, formState: { errors },} = useForm<SchemaProps>({
        resolver: zodResolver(registerSchema),
    })

    const submitForm = (values: z.infer<typeof registerSchema>) => {
        mutate(values, {
            onSuccess: () => {
                setIsSubmitted(true)
            },
            onError: error => {
                console.log(error)
            }
        })
    }

    

  return (
    <>
    <div className="register-container">
        {!isSubmitted ? (
            <div>
                <h2>Create Account</h2> | <small><Link to="/">Back to login</Link></small>
                <form className="marginTop15px" onSubmit={handleSubmit(submitForm)}>
                    <div className="form-group">
                        <div>
                            <label htmlFor="username">Full Name</label>
                            {errors?.username && <span className="error">{errors.username.message}</span>}
                        </div>
                        <input type="text" id="username" required {...register('username')}/>
                    </div>
                    
                    <div className="form-group">
                        <div>
                            <label htmlFor="email">Email Address</label>
                            {errors?.email && <span className="error">{errors.email.message}</span>}
                        </div>
                        <input type="email" id="email" required {...register('email')}/>
                    </div>
                    
                    <div className="form-group">
                        <div>
                            <label htmlFor="password">Password</label>
                            {errors?.password && <span className="error">{errors.password.message}</span>}
                        </div>
                        <input type="password" id="password" required {...register('password')}/>
                    </div>
                    
                    <div className="form-group">
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            {errors?.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
                        </div>
                        <input type="password" id="confirmPassword" required {...register('confirmPassword')}/>
                    </div>
                    
                    <button type="submit" disabled={isPending}>Register</button>
                    
                    <div className="terms marginTop15px">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </div>
                </form>
            </div>
        ) : (
            <div>
                Account created successfully. <small><Link to="/">Back to login</Link></small>
            </div>
        )}
    </div>
    
    </>
  )
}

export default CreateUser