#!/bin/bash

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

# Ejecutar la consulta GraphQL
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$1" \
  http://localhost:3000/graphql)

# Extraer el código de estado HTTP y el cuerpo de la respuesta
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Comprobar si la respuesta contiene errores
if echo "$BODY" | grep -q '"errors":' || [[ $HTTP_CODE -ge 400 ]]; then
  echo -e "${RED}Error (HTTP $HTTP_CODE):${RESET}"
  echo "$BODY" | grep -o '"message":"[^"]*"' | sed 's/"message":"//g' | sed 's/"//g' | while read -r line; do
    echo -e "${RED}• $line${RESET}"
  done
  echo -e "${RED}Respuesta completa:${RESET}"
  echo "$BODY" | jq 2>/dev/null || echo "$BODY"
else
  echo -e "${GREEN}Éxito (HTTP $HTTP_CODE):${RESET}"
  echo "$BODY" | jq 2>/dev/null || echo "$BODY"
fi 