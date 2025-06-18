
# Setup

Clone this repo to your laptop.



## Deployment

to run the project, please open two terminal (front end / backend)

### STEP 1
copy and paste file env.backend to backend folder. rename it to `.env` Afterwards on first terminal please run
```bash
  cd backend
```
activate python environtment
```bash
  pyenv -m venv .venv
```
```bash
source .venv/bin/activate
```
```bash
pip install -r requirements.txt
```
Please wait until installation completed. Next
```bash
npm install
```
next make sure your docker is running. You need to install postgres on docker by running. Make sure not `port 5432` being used by another service.
```bash
docker compose up -d
```
and now please run
```bash
npm run dev
```
### STEP 2
copy and paste file env.frontend to frontend folder. rename it to `.env` Then open second terminal and run
```bash
cd frontend
```
```bash
npm i
```
```bash
npm run dev
```

Now you can open your browser and access to `localhost:5173`

### NOTE: Please register and create user account to login

### Access Backend Swagger
```bash
http://localhost:5000/api-docs
```
To test API, it is recomended to use postman and follow all endpoints as stated in swagger.
I use swagger api version 3, and it seems not support for session token.