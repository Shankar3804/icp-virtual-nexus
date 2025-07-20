
# ICP Virtual Nexus Backend

This directory contains the Rust backend canisters for the ICP Virtual Nexus project.

## Structure

```
backend/
├── src/
│   ├── avatar/          # Avatar registration canister
│   ├── tickets/         # NFT ticket minting canister
│   ├── vr_session/      # VR session management canister
│   └── lib.rs          # Main library
├── Cargo.toml          # Rust dependencies
└── dfx.json           # DFX configuration
```

## Canisters

### 1. Avatar Canister
- Register user avatars
- Store avatar metadata
- Manage avatar ownership

### 2. Tickets Canister  
- Mint NFT event tickets
- Transfer tickets between users
- Query ticket ownership

### 3. VR Session Canister
- Manage active VR sessions
- Handle real-time user interactions
- Store session state

## Development Setup

### Prerequisites
- Install [DFX](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/)
- Install Rust toolchain
- Install `wasm32-unknown-unknown` target

### Commands

```bash
# Start local replica
dfx start --clean

# Deploy canisters locally
dfx deploy

# Generate Candid interfaces
dfx generate

# Build canisters
dfx build

# Check canister status
dfx canister status --all
```

### Candid Interfaces

After deployment, Candid interfaces will be generated in:
- `src/declarations/avatar/`
- `src/declarations/tickets/`
- `src/declarations/vr_session/`

These can be imported into the frontend for type-safe canister calls.

## Environment Configuration

Create a `.env` file for local development:

```env
DFX_NETWORK=local
IC_NETWORK=local
```

For mainnet deployment:

```env
DFX_NETWORK=ic
IC_NETWORK=ic
```

## Testing

```bash
# Run unit tests
cargo test

# Run integration tests with DFX
dfx test
```

## Deployment

### Local Deployment
```bash
dfx deploy --network local
```

### IC Mainnet Deployment
```bash
dfx deploy --network ic --with-cycles 1000000000000
```

## Frontend Integration

The frontend connects to these canisters using the generated Candid interfaces:

```typescript
import { avatar } from '../declarations/avatar';
import { tickets } from '../declarations/tickets';
import { vr_session } from '../declarations/vr_session';

// Example usage
const registerAvatar = async (name: string) => {
  return await avatar.register_avatar(name);
};
```

## Architecture

The backend follows a microservices architecture with each canister handling specific functionality:

1. **Separation of Concerns**: Each canister has a single responsibility
2. **Inter-Canister Communication**: Canisters can call each other when needed
3. **Upgradeable**: All canisters support stable memory for upgrades
4. **Secure**: Principal-based authentication and authorization

## Next Steps

1. Implement the actual Rust canister code
2. Add comprehensive error handling
3. Implement inter-canister calls
4. Add upgrade mechanisms with stable memory
5. Write comprehensive tests
6. Add monitoring and logging
