
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{api, caller, query, update};
use ic_stable_structures::{BTreeMap, DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = DefaultMemoryImpl;

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Ticket {
    pub id: u64,
    pub event_name: String,
    pub owner: Principal,
    pub minted_at: u64,
    pub token_id: String,
    pub metadata: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub struct MintTicketRequest {
    pub event_name: String,
    pub metadata: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub enum TicketError {
    Unauthorized,
    InvalidEventName,
    NotFound,
    TransferFailed,
}

type TicketStorage = StableBTreeMap<u64, Ticket, Memory>;
type OwnershipStorage = StableBTreeMap<Principal, Vec<u64>, Memory>;

thread_local! {
    static TICKETS: RefCell<TicketStorage> = RefCell::new(
        StableBTreeMap::init(DefaultMemoryImpl::default())
    );
    
    static OWNERSHIP: RefCell<OwnershipStorage> = RefCell::new(
        StableBTreeMap::init(DefaultMemoryImpl::default())
    );
    
    static NEXT_TICKET_ID: RefCell<u64> = RefCell::new(1);
}

fn generate_token_id(ticket_id: u64) -> String {
    format!("VRN-{:08X}", ticket_id)
}

#[update]
pub fn mint_ticket(request: MintTicketRequest) -> Result<Ticket, TicketError> {
    let caller = caller();
    
    if request.event_name.trim().is_empty() || request.event_name.len() > 64 {
        return Err(TicketError::InvalidEventName);
    }

    let ticket_id = NEXT_TICKET_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });

    let ticket = Ticket {
        id: ticket_id,
        event_name: request.event_name,
        owner: caller,
        minted_at: api::time(),
        token_id: generate_token_id(ticket_id),
        metadata: request.metadata,
    };

    TICKETS.with(|tickets| {
        tickets.borrow_mut().insert(ticket_id, ticket.clone());
    });

    OWNERSHIP.with(|ownership| {
        let mut ownership = ownership.borrow_mut();
        let mut user_tickets = ownership.get(&caller).unwrap_or_default();
        user_tickets.push(ticket_id);
        ownership.insert(caller, user_tickets);
    });

    Ok(ticket)
}

#[query]
pub fn get_ticket(ticket_id: u64) -> Result<Ticket, TicketError> {
    TICKETS.with(|tickets| {
        let tickets = tickets.borrow();
        tickets.get(&ticket_id).ok_or(TicketError::NotFound)
    })
}

#[query]
pub fn get_my_tickets() -> Vec<Ticket> {
    let caller = caller();
    
    OWNERSHIP.with(|ownership| {
        let ownership = ownership.borrow();
        let ticket_ids = ownership.get(&caller).unwrap_or_default();
        
        TICKETS.with(|tickets| {
            let tickets = tickets.borrow();
            ticket_ids
                .iter()
                .filter_map(|&id| tickets.get(&id))
                .collect()
        })
    })
}

#[query]
pub fn get_tickets_by_owner(owner: Principal) -> Vec<Ticket> {
    OWNERSHIP.with(|ownership| {
        let ownership = ownership.borrow();
        let ticket_ids = ownership.get(&owner).unwrap_or_default();
        
        TICKETS.with(|tickets| {
            let tickets = tickets.borrow();
            ticket_ids
                .iter()
                .filter_map(|&id| tickets.get(&id))
                .collect()
        })
    })
}

#[update]
pub fn transfer_ticket(ticket_id: u64, to: Principal) -> Result<Ticket, TicketError> {
    let caller = caller();
    
    TICKETS.with(|tickets| {
        let mut tickets = tickets.borrow_mut();
        
        match tickets.get(&ticket_id) {
            Some(mut ticket) => {
                if ticket.owner != caller {
                    return Err(TicketError::Unauthorized);
                }
                
                // Update ticket ownership
                ticket.owner = to;
                tickets.insert(ticket_id, ticket.clone());
                
                // Update ownership mappings
                OWNERSHIP.with(|ownership| {
                    let mut ownership = ownership.borrow_mut();
                    
                    // Remove from current owner
                    if let Some(mut from_tickets) = ownership.get(&caller) {
                        from_tickets.retain(|&id| id != ticket_id);
                        ownership.insert(caller, from_tickets);
                    }
                    
                    // Add to new owner
                    let mut to_tickets = ownership.get(&to).unwrap_or_default();
                    to_tickets.push(ticket_id);
                    ownership.insert(to, to_tickets);
                });
                
                Ok(ticket)
            }
            None => Err(TicketError::NotFound),
        }
    })
}

#[query]
pub fn total_tickets() -> u64 {
    NEXT_TICKET_ID.with(|id| *id.borrow() - 1)
}

// Custom getrandom implementation for WASM
#[cfg(target_arch = "wasm32")]
getrandom::register_custom_getrandom!(custom_getrandom);

#[cfg(target_arch = "wasm32")]
pub fn custom_getrandom(buf: &mut [u8]) -> Result<(), getrandom::Error> {
    use ic_cdk::api::management_canister::main::raw_rand;
    
    ic_cdk::spawn(async move {
        let (random_bytes,): (Vec<u8>,) = raw_rand().await.unwrap();
        for (i, byte) in random_bytes.iter().enumerate() {
            if i >= buf.len() {
                break;
            }
            buf[i] = *byte;
        }
    });
    
    Ok(())
}
