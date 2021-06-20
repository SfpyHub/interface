FROM gcr.io/safepay/go-base:unstable

EXPOSE 3546

COPY interfaceStartup.sh /
COPY sfpy-interface /
COPY container_info.txt /
COPY . /build

WORKDIR /build

ENTRYPOINT ["./interfaceStartup.sh"]