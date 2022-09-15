FROM asapdotid/node-frontend



ENV NODE_ENV=staging

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

COPY . .

CMD  ["sh", "-c", "yarn i && npx prisma generate && yarn deploy"]

EXPOSE 3000