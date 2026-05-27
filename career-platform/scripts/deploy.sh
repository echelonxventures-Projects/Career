#!/bin/bash

# Career Platform Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Deploying Career Platform to $ENVIRONMENT..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher"
        exit 1
    fi

    # Check for required env vars
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL is not set"
        exit 1
    fi

    if [ -z "$NEXTAUTH_SECRET" ]; then
        print_error "NEXTAUTH_SECRET is not set"
        exit 1
    fi

    if [ "$ENVIRONMENT" = "production" ]; then
        if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
            print_warning "Google OAuth credentials not set"
        fi

        if [ -z "$LINKEDIN_CLIENT_ID" ] || [ -z "$LINKEDIN_CLIENT_SECRET" ]; then
            print_warning "LinkedIn OAuth credentials not set"
        fi
    fi

    print_status "Prerequisites checked"
}

# Run security audit
run_security_audit() {
    echo "🔒 Running security audit..."

    if npm audit --audit-level=high; then
        print_status "No high-severity vulnerabilities found"
    else
        print_warning "Security vulnerabilities detected. Run 'npm audit fix' to resolve."
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."

    npx prisma migrate deploy
    npx prisma generate

    print_status "Database migrations complete"
}

# Build application
build_application() {
    echo "🏗️ Building application..."

    # Clean previous build
    rm -rf .next

    # Build with production settings
    NODE_ENV=production npm run build

    print_status "Build complete"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."

    # Type checking
    npx tsc --noEmit

    # Linting
    npm run lint -- --max-warnings=10

    print_status "Tests passed"
}

# Deploy to Vercel
deploy_to_vercel() {
    echo "🌐 Deploying to Vercel..."

    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not installed. Run: npm i -g vercel"
        exit 1
    fi

    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod
    else
        vercel
    fi

    print_status "Deployed to Vercel"
}

# Main deployment flow
main() {
    echo "========================================"
    echo "Career Platform Deployment"
    echo "Environment: $ENVIRONMENT"
    echo "========================================"
    echo

    check_prerequisites
    run_security_audit
    run_tests
    run_migrations
    build_application

    # Ask for confirmation before production deploy
    if [ "$ENVIRONMENT" = "production" ]; then
        echo
        print_warning "About to deploy to PRODUCTION!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Deployment cancelled"
            exit 0
        fi
    fi

    # Deploy
    if command -v vercel &> /dev/null; then
        deploy_to_vercel
    else
        print_status "Build complete. Deploy manually or configure CI/CD."
    fi

    echo
    echo "========================================"
    print_status "Deployment complete!"
    echo "========================================"
}

# Run main function
main
