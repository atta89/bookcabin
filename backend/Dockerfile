# Use official Golang image
FROM golang:1.22-alpine

# Enable CGO for sqlite
ENV CGO_ENABLED=1

# Install dependencies
RUN sed -i 's/dl-cdn.alpinelinux.org/ftp.tsukuba.wide.ad.jp/g' /etc/apk/repositories \
    && apk add --no-cache gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod ./
COPY go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the app
RUN go build -o main .

# Expose port
EXPOSE 8080

# Run the app
CMD ["./main"]
