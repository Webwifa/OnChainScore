#!/bin/bash

# OnChainScore IC Deployment Script
# This script deploys the OnChainScore application to the Internet Computer

echo "🚀 Starting OnChainScore deployment to Internet Computer..."

# Check if we have the right identity
echo "📋 Current identity: $(dfx identity whoami)"
echo "📋 Principal ID: $(dfx identity get-principal)"

# Check cycles balance
echo "💰 Checking cycles balance..."
dfx cycles balance --network ic

# Check if canisters are already created
echo "📦 Checking existing canisters..."
dfx canister status --all --network ic 2>/dev/null || echo "No canisters found, will create new ones"

# Create canisters if they don't exist
echo "🏗️  Creating canisters on IC..."
dfx canister create --all --network ic

# Build the project
echo "🔨 Building project for IC..."
dfx build --network ic

# Deploy backend canister
echo "🚀 Deploying backend canister..."
dfx deploy OnChainScore_backend --network ic

# Deploy frontend canister
echo "🌐 Deploying frontend canister..."
dfx deploy OnChainScore_frontend --network ic

# Get canister URLs
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your OnChainScore application is now live on the Internet Computer!"
echo ""
echo "📍 Backend Canister ID: $(dfx canister id OnChainScore_backend --network ic)"
echo "📍 Frontend Canister ID: $(dfx canister id OnChainScore_frontend --network ic)"
echo ""
echo "🌐 Frontend URL: https://$(dfx canister id OnChainScore_frontend --network ic).ic0.app"
echo "🔗 Backend URL: https://$(dfx canister id OnChainScore_backend --network ic).raw.ic0.app"
echo ""
echo "💡 Note: It may take a few minutes for the canisters to be fully available"
echo "💡 You can check status with: dfx canister status --all --network ic"
