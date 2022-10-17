FROM node:16.16.0-slim as build
WORKDIR /app
COPY . ./
ADD https://raw.githubusercontent.com/npocccties/chiloportal/develop/backend/doc/openapi.yaml /backend/doc/openapi.yaml
RUN echo "38cc3c5cc7c96e57df84ebdccc23ced2  ../backend/doc/openapi.yaml" > md5sum.txt && md5sum -c md5sum.txt
RUN corepack yarn install --immutable
ARG NEXT_PUBLIC_API_BASE_URL=http://dev-portal.oku.cccties.org/api/v1/
ARG NEXT_PUBLIC_MOODLE_DASHBOARD_URL=https://opedu.lib.osaka-kyoiku.ac.jp/my/
ENV NEXT_PUBLIC_API_MOCKING=false
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_MOODLE_DASHBOARD_URL=${NEXT_PUBLIC_MOODLE_DASHBOARD_URL}
RUN yarn build

FROM node:16.16.0-slim as install
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