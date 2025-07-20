
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{api, caller, query, update};
use ic_stable_structures::{BTreeMap, DefaultMemoryImpl, StableBTreeMap};
use serde::Serialize;
use std::cell::RefCell;

type Memory = DefaultMemoryImpl;

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Avatar {
    pub name: String,
    pub owner: Principal,
    pub created_at: u64,
    pub metadata: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub struct RegisterAvatarRequest {
    pub name: String,
    pub metadata: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub enum AvatarError {
    Unauthorized,
    AvatarAlreadyExists,
    InvalidName,
    NotFound,
}

type AvatarStorage = StableBTreeMap<Principal, Avatar, Memory>;

thread_local! {
    static AVATARS: RefCell<AvatarStorage> = RefCell::new(
        StableBTreeMap::init(DefaultMemoryImpl::default())
    );
}

#[update]
pub fn register_avatar(request: RegisterAvatarRequest) -> Result<Avatar, AvatarError> {
    let caller = caller();
    
    if request.name.trim().is_empty() || request.name.len() > 32 {
        return Err(AvatarError::InvalidName);
    }

    AVATARS.with(|avatars| {
        let mut avatars = avatars.borrow_mut();
        
        if avatars.contains_key(&caller) {
            return Err(AvatarError::AvatarAlreadyExists);
        }

        let avatar = Avatar {
            name: request.name,
            owner: caller,
            created_at: api::time(),
            metadata: request.metadata,
        };

        avatars.insert(caller, avatar.clone());
        Ok(avatar)
    })
}

#[query]
pub fn get_avatar(principal: Principal) -> Result<Avatar, AvatarError> {
    AVATARS.with(|avatars| {
        let avatars = avatars.borrow();
        avatars.get(&principal).ok_or(AvatarError::NotFound)
    })
}

#[query]
pub fn get_my_avatar() -> Result<Avatar, AvatarError> {
    let caller = caller();
    get_avatar(caller)
}

#[update]
pub fn update_avatar_metadata(metadata: String) -> Result<Avatar, AvatarError> {
    let caller = caller();
    
    AVATARS.with(|avatars| {
        let mut avatars = avatars.borrow_mut();
        
        match avatars.get(&caller) {
            Some(mut avatar) => {
                avatar.metadata = Some(metadata);
                avatars.insert(caller, avatar.clone());
                Ok(avatar)
            }
            None => Err(AvatarError::NotFound),
        }
    })
}

#[query]
pub fn list_avatars() -> Vec<Avatar> {
    AVATARS.with(|avatars| {
        let avatars = avatars.borrow();
        avatars.iter().map(|(_, avatar)| avatar).collect()
    })
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
