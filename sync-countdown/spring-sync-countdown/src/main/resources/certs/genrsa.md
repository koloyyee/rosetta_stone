# How to Generate Private and Public Key Pair?

# 1. Generate a Private Key
# 2. Generate a Public Key from the Private Key
```sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
