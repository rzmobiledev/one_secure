import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import Login from './login/index'
import CreateUser from './register/CreateUser'
import Dashboard from './dashboard/dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {Provider } from 'react-redux'
import {store} from './redux/store/store'

import {
  RouterProvider,
  redirect,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


const rootRoute = createRootRoute({
  component: () => (
    <>
    <Outlet />
    <TanStackRouterDevtools />
    </>
  )
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
  beforeLoad: async () => {
    // Dispatch Redux thunk to check auth status
    const { isUser } = store.getState().auth;
    console.log(isUser)
    if (!isUser) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: function Register() {
    return (
      <CreateUser/>
    )
  },
})

const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const routeTree = rootRoute.addChildren([indexRoute, registerRoute, LoginRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={new QueryClient()}>
    <StrictMode>
      <Provider store={store}>
      <RouterProvider router={router}/>
      </Provider>
    </StrictMode>
  </QueryClientProvider>,
)
