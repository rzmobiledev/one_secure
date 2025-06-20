
# Installation

Clone this repo to your laptop.
```bash
git clone git@github.com:rzmobiledev/one_secure.git
```
```bash
cd one_secure
```

## DOCKER SETUP
#### rename this file:
- `env.docker-compose` to be `.env`
- copy and paste `file env.frontend` to frontend folder. rename it to `.env`
- copy and paste `file env.backend` to backend folder. rename it to `.env`

Next back to project path (where `docker-compose.yaml` located) and run `docker compose`
```bash
  docker compose -d
```
Access the website with current link.
```bash
http://127.0.0.1:5173
```
**Note**: Do not use `localhost` on above link otherwise your `accessToken` will not work as expected.

## MANUAL SETUP

If you want to run the project without `docker`, please open two terminal (`front end` / `backend`)

### STEP 1
- Make sure `Docker desktop` is running and and no `port 5432` being used by another service.
- Open `docker-compose.yaml` file and comment `services backend` and `services frontend`. Leave uncomment for `backend` and `volumes`  

copy and paste file `env.backend` to backend folder. rename it to `.env`. Next open `.env` file and change:
- `HOST='localhost'`
- `COOKIE_DOMAIN='localhost'`

Next do the same with `env.frontend` file, copy and paste to `frontend` folder and rename it to `.env` file and change it to:
```bash
VITE_API_BASE_URL='http://localhost:5000/api/v1'
```

Open new terminal inside `docker-compose.yaml` path and run
```bash
docker compose up -d
```
Next
```bash
  cd backend
```
activate python environment
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
```bash
npx prisma generate
```
```bash
npx prisma db push
```
```bash
npm run dev
```

### STEP 2
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

**NOTE**: Please register and create `user account` to `login page`

### Access Backend Swagger
```bash
http://localhost:5000/api-docs
```
To test API, it is recomended to use postman and follow all endpoints as stated in swagger.
I use swagger api version 3, and it seems not support for `http token`.
