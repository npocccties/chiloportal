FROM node:20.9.0-slim as base
WORKDIR /app
COPY .yarnrc.yml yarn.lock package.json ./
COPY .yarn/ ./.yarn

FROM base as build
RUN corepack yarn install --immutable
COPY .env* .eslintrc.yaml .gitignore config.yaml next.config.js postcss.config.js tailwind.config.js tsconfig.json vfile-env.d.ts ./
COPY components/ ./components
COPY contents/ ./contents
COPY lib/ ./lib
COPY mocks/ ./mocks
COPY overrides/ ./overrides
COPY pages/ ./pages
COPY posts/ ./posts
COPY public/ ./public
COPY schemas/ ./schemas
COPY styles/ ./styles
COPY templates/ ./templates
ADD https://raw.githubusercontent.com/npocccties/chiloportal/develop/backend/doc/openapi.yaml /backend/doc/openapi.yaml
RUN echo "ae3b23e07629a49cd07acdc46e4754c2  ../backend/doc/openapi.yaml" > md5sum.txt && md5sum -c md5sum.txt
RUN corepack yarn build

FROM base as install
RUN corepack yarn workspaces focus --all --production

FROM gcr.io/distroless/nodejs:20
WORKDIR /app
ENV NODE_ENV=production
COPY public/ ./public
COPY --from=build /app/.next ./.next
COPY --from=install /app/node_modules ./node_modules

CMD ["node_modules/next/dist/bin/next", "start"]
