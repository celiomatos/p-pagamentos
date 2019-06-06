FROM node:10.16.0-alpine
WORKDIR /app
COPY . .
ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
  && apk update \
  && apk upgrade \
  && apk add tzdata \
  && cp /usr/share/zoneinfo/America/Manaus /etc/localtime \
  && echo "America/Manaus" > /etc/timezone \
  && apk del tzdata \
  \
  # replacing default repositories with edge ones
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  \
  # Add the packages
  && apk add --no-cache dumb-init curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++ nss chromium \
  \
  && npm install \
  \
  # Do some cleanup
  && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
  && echo
ENTRYPOINT ["/usr/bin/dumb-init"]
CMD crond -l 2 -f