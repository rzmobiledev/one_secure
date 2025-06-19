FROM node:current-alpine3.21 AS base
LABEL maintainer="rzmobiledev@gmail.com"

FROM base AS builder
WORKDIR /install
COPY scripts/ /scripts
RUN apk update && apk upgrade && apk add --no-cache bash && \
adduser --disabled-password --no-create-home rz && \
chmod -R +x /scripts 

USER rz

FROM base AS production
WORKDIR /app
COPY . /app
COPY --from=builder /scripts /usr/local/bin
RUN npm ci --only=production && rm -rf ./dist && npm run build 


EXPOSE 5713
ENV PATH="/scripts:usr/local/bin:$PATH"
ENTRYPOINT ["automation.sh"]
