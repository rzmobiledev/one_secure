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

    type ErrorResponse = {
        message: string
    }

    const [domainName, setDomainName] = React.useState<string>('')
    const [result, setResult] = React.useState<string>('')
    const dispatch = useDispatch()
    const { isUser } = useSelector(selectAllAuthState);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: logoutMutationFn,
    });

    const { mutate: checkDomain, isPending } = useMutation({
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
            onError: (error: ErrorResponse) => {
                setResult(error.message)
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
            {result ? (
                <div className="chart-container" style={{marginTop: 15}}>
                    <h3>Notes:</h3>
                    <div id="chart">
                        <div style={{ textAlign: "left", paddingTop: 20}}>
                        <ul dir="auto">
                            <li>
                            <p dir="auto">NO MX Record for the domain : In this case the domain is not used for email purposes. For such domains the ideal value of SPF and DMARC for spoofing prevention should be :</p>
                            <ul dir="auto">
                            <li>"v=spfv1 -all" : This ensures that no server can send email for the domain.</li>
                            <li>"v=DMARC1; p=reject; rua=<a href="mailto:admin@domain.tld">mailto:admin@domain.tld</a>" : Mail is rejected on receiving end and report is generated and sent to email addreess specified.</li>
                            <li>DKIM for such domain is not required as it won't be used in communication</li>
                            </ul>
                            </li>
                            <li>
                            <p dir="auto">MX Record is valid: In this case check for SPF and DMARC values for predicting if the mail can be spoofed.</p>
                            <ul dir="auto">
                            <li>Check for SPF issues like more than 10 lookups, void lookups and syntax errors</li>
                            <li>The DMARC value can be following:
                            <ul dir="auto">
                            <li>p=none : This mode means the DMARC is in monitoring mode. If the SPF and DKIM fails, reports would be generated email specified in record. Spoofing is possible here.</li>
                            <li>p=quarantine : If DKIM and SPF fails, mail goes to spam folder.</li>
                            <li>p=reject : This is the ideal value that should be opted for best security. The email would be rejected and report would be generated and sent to specified email.</li>
                            </ul>
                            </li>
                            <li>DKIM field may be verified using the selectors. If the script is unable to find DKIM, use custom selectors or find selector using email header analysis of emails received from the people of that domain.</li>
                            </ul>
                            </li>
                        </ul>
                        </div>
                    
                    </div>
                </div>
            ): ''}
        </div>
    </div>
  )
}

export default Dashboard