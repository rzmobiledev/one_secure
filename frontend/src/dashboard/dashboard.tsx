import { useNavigate } from '@tanstack/react-router'
import {useMutation} from "@tanstack/react-query"
import '../assets/dashboard.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAllAuthState } from '../redux/features/authSlice'
import {logoutMutationFn} from "../utils/api"

function Dashboard() {
    const dispatch = useDispatch()
    const { isUser } = useSelector(selectAllAuthState);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: logoutMutationFn,
    });

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
                    <h3>Checking Domain</h3>
                    <p>1,234</p>
                </div>
            </div>
            
            <div className='stats-grid'>
                <div className="form-group">
                    <label htmlFor="domain">Check Domain here</label>
                    <input type="text" id="domain" name="domain" required placeholder='facebook.com & hit enter'/>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>1,234</p>
                </div>
            </div>
            <div className="chart-container">
                <h3>Performance Overview</h3>
                <div id="chart">
                    <p style={{ textAlign: "center", padding: "40px" }}>Chart Placeholder</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard