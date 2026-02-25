#!/bin/bash
# One-time setup: generates Homebase.xcodeproj from project.yml
# Usage: cd Homebase && ./setup.sh

set -e

# Install xcodegen if needed
if ! command -v xcodegen &> /dev/null; then
    echo "Installing xcodegen via Homebrew..."
    brew install xcodegen
fi

echo "Generating Xcode project..."
xcodegen generate

echo "Done! Opening project..."
open Homebase.xcodeproj
