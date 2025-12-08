#!/bin/bash

# Script para crear usuario Admin y Profesor
# Uso: ./crear-usuarios.sh

API_URL="https://apilearning.getdevtools.com"

echo "🚀 Creando usuarios Admin y Profesor..."
echo ""

# Crear Admin
echo "📝 Creando usuario Administrador..."
ADMIN_RESPONSE=$(curl -s -X POST "${API_URL}/users" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "full_name": "Administrador Principal",
    "email": "admin@getdevtools.com",
    "password": "admin123",
    "role": "super_admin"
  }')

if echo "$ADMIN_RESPONSE" | grep -q "id"; then
  echo "✅ Admin creado exitosamente"
  echo "   Email: admin@getdevtools.com"
  echo "   Contraseña: admin123"
else
  echo "❌ Error al crear admin:"
  echo "$ADMIN_RESPONSE"
fi

echo ""

# Crear Profesor
echo "📝 Creando usuario Profesor..."
PROFESSOR_RESPONSE=$(curl -s -X POST "${API_URL}/users" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "87654321",
    "full_name": "Profesor Ejemplo",
    "email": "profesor@getdevtools.com",
    "password": "profesor123",
    "role": "profesor"
  }')

if echo "$PROFESSOR_RESPONSE" | grep -q "id"; then
  echo "✅ Profesor creado exitosamente"
  echo "   Email: profesor@getdevtools.com"
  echo "   Contraseña: profesor123"
else
  echo "❌ Error al crear profesor:"
  echo "$PROFESSOR_RESPONSE"
fi

echo ""
echo "✨ Proceso completado!"
echo ""
echo "📋 Credenciales:"
echo "   Admin: admin@getdevtools.com / admin123"
echo "   Profesor: profesor@getdevtools.com / profesor123"
echo ""
echo "🔗 Inicia sesión en: https://learning.getdevtools.com/login"

