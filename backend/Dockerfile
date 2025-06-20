FROM python:3.10.5-slim-buster AS base

LABEL maintainer="rzmobiledev@gmail.com"
ENV PYTHONUNBUFFERED=1

FROM base AS builder
WORKDIR /install
COPY requirements.txt .
COPY scripts/ /scripts
RUN apt update && \
	pip install --upgrade pip && pip install --prefix="/install" -r requirements.txt && \
    adduser --disabled-password --no-create-home \
    rz && chmod -R +x /scripts
	
USER rz

FROM base AS prod
WORKDIR /app
COPY --from=builder  /install /usr/local
COPY --from=builder /scripts /usr/local/bin
COPY . .
RUN  apt-get update && apt-get install -y curl gnupg && \
curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
apt-get install -y nodejs && \ 
npm ci && rm -rf ./dist && npm run build
COPY /domaincheck /dist/domaincheck
COPY /prisma ./dist

ENV PATH="/scripts:usr/local/bin:$PATH"
EXPOSE 5000
ENTRYPOINT ["automation.sh"]