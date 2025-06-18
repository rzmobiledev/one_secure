import { Link } from "@tanstack/react-router";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import {useMutation} from "@tanstack/react-query"
import '../assets/App.css'
import {loginSchema} from '../utils/schema'
import {loginMutationFn} from "../utils/api"
import { useNavigate  } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import {login, logout, selectAllAuthState} from '../redux/features/authSlice'

function Login() {
  const { isUser } = useSelector(selectAllAuthState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
});

  type SchemaProps = z.infer<typeof loginSchema>

  const {register, handleSubmit, formState: { errors },} = useForm<SchemaProps>({
          resolver: zodResolver(loginSchema),
      })
      

  const submitForm = (values: z.infer<typeof loginSchema>) => {
          mutate(values, {
              onSuccess: () => {
                  dispatch(login())
              },
              onError: (error) => {
                console.log(error)
                dispatch(logout())
              }
          })
      }

      if (isUser) {
        // If already authenticated, redirect to home or previous page
        navigate({ to: '/' });
        return null;
      }
      
  return(
      <div className="login-container">
        <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Please login to your account</p>
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="form-group">
                  <div>
                    <label htmlFor="email">Email</label>
                    {errors?.email && <span className="error">{errors.email.message}</span>}
                  </div>
                  <input type="email" id="email" placeholder="Enter your email" required {...register('email')}/>
              </div>
              <div className="form-group">
                  <div>
                    <label htmlFor="password">Password</label>
                    {errors?.password && <span className="error">{errors.password.message}</span>}
                  </div>
                  <input type="password" id="password" placeholder="Enter your password" required {...register('password')}/>
              </div>
              
              <button type="submit" className="login-button" disabled={isPending}>Login</button>
              <div className="forgot-password">
                  <Link to="/register">Create account</Link>
              </div>
          </form>
      </div>
    </div>
  )
}

export default Login
