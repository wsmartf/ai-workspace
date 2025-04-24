#!/bin/bash

# Install Rust if not present
if ! command -v cargo &> /dev/null; then
  echo "Installing Rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
  echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
  echo "Rust installed and shell config updated. Please restart your terminal."
else
  echo "Rust already installed."
fi

# Install npm deps
echo "Installing Node packages..."
npm install

echo "✅ Setup complete. You can now run: npm run tauri dev"
