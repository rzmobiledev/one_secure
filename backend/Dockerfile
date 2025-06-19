FROM node:current-alpine3.21 AS base
LABEL maintainer="rzmobiledev@gmail.com"

FROM base AS builder
WORKDIR /install
COPY package*.json .
COPY scripts/ /scripts
RUN apk update && apk upgrade && apk add --no-cache bash && \
apk add --update --no-cache python3 py3-pip && \
ln -sf python3 /usr/bin/python && \
pip3 install --no-cache --upgrade pip3 setuptools && \
pip3 install --prefix="/install" -r requirements_new.txt && \
adduser --disabled-password --no-create-home rz && \
chmod -R +x /scripts 

USER rz

FROM base AS production
WORKDIR /app
COPY . /app
COPY --from=builder /scripts /usr/local/bin
RUN npm ci --only=production && rm -rf ./dist && npm run build 

EXPOSE 5000
ENV PATH="/scripts:usr/local/bin:$PATH"
ENTRYPOINT ["automation.sh"]