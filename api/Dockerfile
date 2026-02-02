FROM golang:1.23-alpine

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build
RUN go build -o server ./cmd/server

EXPOSE 4000

CMD ["./server"]
