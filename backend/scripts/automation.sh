#!/bin/sh

set -e
npx prisma db push
npm run start
echo "================================="
echo "YOUR SERVER IS UP AND RUNNING NOW"
echo "================================="