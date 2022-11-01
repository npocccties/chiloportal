FROM node:16.18.0-slim as build
WORKDIR /app
COPY . ./
ADD https://raw.githubusercontent.com/npocccties/chiloportal/develop/backend/doc/openapi.yaml /backend/doc/openapi.yaml
RUN echo "ae3b23e07629a49cd07acdc46e4754c2  ../backend/doc/openapi.yaml" > md5sum.txt && md5sum -c md5sum.txt
RUN corepack yarn install --immutable
RUN yarn build

FROM node:16.18.0-slim as install
WORKDIR /app
COPY . ./
RUN corepack yarn workspaces focus --all --production

FROM gcr.io/distroless/nodejs:16
WORKDIR /app
ENV NODE_ENV=production
COPY ./public ./public
COPY --from=build /app/.next ./.next
COPY --from=install /app/node_modules ./node_modules

CMD ["node_modules/next/dist/bin/next", "start"]
