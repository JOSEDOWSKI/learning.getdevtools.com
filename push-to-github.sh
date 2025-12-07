#!/bin/bash
# Script para hacer push a GitHub

echo "🚀 Subiendo código a GitHub..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

# Verificar que el remote está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: Remote 'origin' no está configurado"
    exit 1
fi

echo "📦 Repositorio: $(git remote get-url origin)"
echo "📝 Último commit: $(git log -1 --oneline)"
echo ""

# Intentar push
echo "⏳ Intentando hacer push..."
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ ¡Código subido exitosamente a GitHub!"
    echo "🔗 Ver en: https://github.com/JOSEDOWSKI/learning.getdevtools.com"
else
    echo ""
    echo "❌ Error al hacer push. Necesitas autenticarte."
    echo ""
    echo "📋 Opciones:"
    echo ""
    echo "1. Usar Token de GitHub (Recomendado):"
    echo "   - Ve a: https://github.com/settings/tokens"
    echo "   - Genera un token con scope 'repo'"
    echo "   - Ejecuta: git push -u origin main"
    echo "   - Usuario: JOSEDOWSKI"
    echo "   - Contraseña: (pega el token)"
    echo ""
    echo "2. Usar GitHub CLI:"
    echo "   - gh auth login"
    echo "   - git push -u origin main"
    echo ""
    echo "3. Configurar SSH:"
    echo "   - ssh-keygen -t ed25519 -C 'tu-email@example.com'"
    echo "   - Agrega la clave pública a GitHub"
    echo "   - git remote set-url origin git@github.com:JOSEDOWSKI/learning.getdevtools.com.git"
    echo "   - git push -u origin main"
fi

