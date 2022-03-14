FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
RUN apt-get update \
    && apt-get install -y \
        libc6-dev \
        libx11-dev \
        libgdiplus \
        libgif-dev autoconf libtool automake build-essential gettext libglib2.0-dev libcairo2-dev libtiff-dev libexif-dev
EXPOSE 80
EXPOSE 443