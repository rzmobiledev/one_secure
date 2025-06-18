import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {useMutation } from "@tanstack/react-query"
import '../assets/dashboard.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAllAuthState } from '../redux/features/authSlice'
import {logoutMutationFn, domainCheckMutationFn} from "../utils/api"

function Dashboard() {

    type ResData = {
        data: {
            data: string
        }
    }

    const [domainName, setDomainName] = React.useState<string>('')
    const [result, setResult] = React.useState<string>('')
    const dispatch = useDispatch()
    const { isUser } = useSelector(selectAllAuthState);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: logoutMutationFn,
    });

    const { mutate: checkDomain, isPending, isError, data, error } = useMutation({
        mutationFn: domainCheckMutationFn,
    })


    if (!isUser) {
        navigate({ to: '/login' });
        return null;
      }

      const onLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                dispatch(logout())
            },
            onError: (error) => {
            console.log(error)
            dispatch(logout())
            }
        })
      }

      const checkDomainHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const domain = formData.get('domain') as string

        setDomainName(domain)
        if (!domain) return
        checkDomain({ domain }, {
            onSuccess: (data) => {
                const rData = data as unknown as ResData
                const res = rData.data.data
                setResult(res)
                return
            },
            onError: (error: unknown) => {
                console.log(error)
            }
        })
      }
      
  return (
    <div className="dashboard">
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li>Overview</li>
                <li onClick={onLogout}>Logout</li>
            </ul>
        </div>
        <div className="main-content">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Checking Domain {domainName}</h3>
                    <div className='stats-grid'>
                        <form className="form-group" onSubmit={checkDomainHandler}>
                            <label htmlFor="domain">Check Domain here</label>
                            <input type="text" id="domain" name="domain" required placeholder='facebook.com & hit enter'/>
                            <button type="submit" disabled={isPending} style={{marginTop: 5}}>{isPending ? "Please wait..." : "Check"}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <h3>Output</h3>
                <div id="chart">
                    <p style={{ textAlign: "left", paddingTop: 20}}>{result ? result : "Result of checking domain will display here..."}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard