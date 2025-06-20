#!/bin/sh

set -e
/usr/local/bin/wait-for-it.sh db:5432
npx prisma db push
npm run start
echo "================================="
echo "YOUR SERVER IS UP AND RUNNING NOW"
echo "================================="