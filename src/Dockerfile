FROM public.ecr.aws/lambda/nodejs:20
RUN npm install --global yarn
COPY ./package.json ./yarn.lock ./
RUN yarn install --production --frozen-lockfile --non-interactive
COPY ./ ./
RUN yarn build
