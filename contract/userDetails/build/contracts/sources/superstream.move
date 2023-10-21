module contracts::superstream {
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use sui::dynamic_object_field as dof;
    use sui::coin::{Self, Coin};
    use sui::sui::{SUI};
    use sui::event;

    use std::string::{Self, String};
    use std::vector::{Self};
    
    
    //errors
    const EUsernameTaken: u64 = 1;

    struct DataHouse has key, store {
        id: UID,
        usernameToProfile: Table<String, ID>,
        addressToUsername: Table<address, String>,
        addressToStreamKey: Table<address, String>,

        isPublished: VecSet<String>,
        commentsByTopic: Table<String, vector<Comment>>,
        subscriptions: Table<address, Table<String, Subscription>>,
    }

    struct Stream has key, store{
        id: UID,
        creator: String,
        sessionId: String,
        views: u64,
        isSubscribersOnly: bool,
    }

    struct Profile has store,key {
        id: UID,
        subscriptionCharge: u128,
        subscribersCount: u64,
        isOnlySubscribers:bool,
        username: String,
        bio: String,
        pfp: String,
        streamId: ID,
        defaultTitle: String,
        defaultThumbnail: String,
        followers: vector<String>,
        follows:vector<String>,
        owner: address,
    }

    struct Comment has store {
        createdAt: u64,
        topic: String,
        message: String,
        senderUsername: String,
        senderAddress: address,
    }

    struct Subscription has store {
        startedAt: u64,
        flowRate: u128,
        toUsername: String,
        toAddress: address,
        fromAddress: address,
    }

    
    struct OwnerCap has key,store {
        id: UID
    }

    // witness
    struct SUPERSTREAM has drop {

    }

    //Event 
    struct EventProfileCreated has copy,drop {
        profileId: ID,
    }

    struct EventTipped has copy, drop {
        sender: address,
        receiver: address,
        amount: u64,
    }

    struct EventFollowed has copy, drop {
        from: String,
        to: String,
    }

    // constructor
    fun init(_: SUPERSTREAM, ctx:&mut TxContext) {
        // transfer OwnerCap to the contrac of owner
        transfer::transfer(OwnerCap{
            id: object::new(ctx),
        }, tx_context::sender(ctx));

        transfer::share_object(DataHouse{
            id: object::new(ctx),
            usernameToProfile: table::new(ctx),
            addressToUsername: table::new(ctx),
            addressToStreamKey: table::new(ctx),

            isPublished: vec_set::empty(),
            commentsByTopic: table::new(ctx),
            subscriptions: table::new(ctx),
        });
    }

    // Profile Function
    public entry fun addProfile(datahouse:&mut DataHouse, username: String, bio: String, pfp: String, streamId: ID, streamKey: String, ctx:&mut TxContext) {
        assert!(table::contains(&datahouse.usernameToProfile, username)==true, EUsernameTaken);

        let sender = tx_context::sender(ctx);
        let profile = Profile{
            id: object::new(ctx),
            subscriptionCharge: 0,
            subscribersCount: 0,
            isOnlySubscribers: false,
            username: username,
            bio: bio,
            pfp: pfp,
            streamId: streamId,
            defaultTitle: string::utf8(b""),
            defaultThumbnail: string::utf8(b""),
            followers: vector::empty(),
            follows: vector::empty(),
            owner: sender,
        };

        let profileId = object::id(&profile);
        
        dof::add(&mut datahouse.id, profileId, profile);
        table::add(&mut datahouse.usernameToProfile, username, profileId);
        table::add(&mut datahouse.addressToUsername, sender, username);
        table::add(&mut datahouse.addressToStreamKey, sender, streamKey);

        event::emit(EventProfileCreated{
            profileId: profileId,
        });
    }

    public entry fun tip(receiver: address, amount: Coin<SUI>, ctx: &TxContext) {

        event::emit(EventTipped{
            sender: tx_context::sender(ctx),
            receiver: receiver,
            amount: coin::value(&amount),
        });
        transfer::public_transfer(amount, receiver);
    }

    public entry fun follow(datahouse:&mut DataHouse, to: String, ctx:&TxContext) {
        let from = table::borrow(&datahouse.addressToUsername, tx_context::sender(ctx));
        let fromProfileId = table::borrow(&datahouse.usernameToProfile, *from);
        let fromProfile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *fromProfileId);
        vector::push_back(&mut fromProfile.follows, to);

        let toProfileId = table::borrow(&datahouse.usernameToProfile, to);
        let toProfile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *toProfileId);
        vector::push_back(&mut toProfile.followers, *from);
    }

    public entry fun setStreamInfo(title: String, thumbnail:String) {

    }

}