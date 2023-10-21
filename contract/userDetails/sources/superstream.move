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
    use sui::clock::{Self, Clock};

    use std::string::{Self, String};
    use std::vector::{Self};
    
    
    //errors
    const EUsernameTaken: u64 = 1;
    const EUnauthorized: u64 = 2;
    const ESubscriptionExist: u64 = 3;
    const ESubscriptionNotExist: u64 = 4;
    const EInsufficientFlowRate:u64 = 5;

    struct DataHouse has key, store {
        id: UID,
        usernameToProfile: Table<String, ID>,
        addressToUsername: Table<address, String>,
        addressToStreamKey: Table<address, String>,

        isPublished: VecSet<String>,
        commentsByTopic: Table<String, vector<Comment>>,
        subscriptions: Table<address, Table<String, Subscription>>,
        streams: Table<u128, Stream>,
    }

    struct Stream has store{
        id: u128,
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

    struct Subscription has store,drop {
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

    struct EventStreamPublished has copy, drop{
        streamNftId: u128, 
        creator: address,
    }

    struct EventFollowed has copy, drop {
        from: String,
        to: String,
    }

    struct EventTipped has copy, drop {
        sender: address,
        receiver: address,
        amount: u64,
    }

    struct EventCommentAdded has copy, drop {
        topic: String,
        position: u64,
    }

    struct EventSubscribed has copy, drop {
        from: address,
        toAddress: address,
        toUsername: String,
        flowRate: u128,
    }
    struct EventUnsubscribed has copy, drop {
        subscriber: address,
        creator: String,
    }

    struct EventLivestreamInfoUpdated has copy, drop {
        creator: address,
        newTitle: String,
    }

    struct EventSubscriptionChargeUpdated has copy, drop {
        creator: address,
        newFlowRate: u128,
    }

    struct EventVideoViewed has copy, drop {
        id:u128,
        viewer: address,
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
            streams: table::new(ctx),
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

        event::emit(EventFollowed{
            from: *from,
            to: to,
        });
    }

    public entry fun setStreamInfo(datahouse: &mut DataHouse,title: String, thumbnail:String, ctx:&TxContext) {
        let sender = tx_context::sender(ctx);
        let senderUsername = table::borrow(&datahouse.addressToUsername, sender);
        let profileId = table::borrow(&datahouse.usernameToProfile, *senderUsername);
        let profile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *profileId);

        profile.defaultThumbnail = thumbnail;
        profile.defaultTitle = title;

        event::emit(EventLivestreamInfoUpdated{
            creator: sender,
            newTitle: title,
        });
    }

    public entry fun setSubscriptionCharge(datahouse: &mut DataHouse, flowRate: u128, ctx:&TxContext) {
        let sender = tx_context::sender(ctx);
        let senderUsername = table::borrow(&datahouse.addressToUsername, sender);
        let profileId = table::borrow(&datahouse.usernameToProfile, *senderUsername);
        let profile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *profileId);
        profile.subscriptionCharge = flowRate;

        event::emit(EventSubscriptionChargeUpdated{
            creator: sender,
            newFlowRate: flowRate,
        });
    }

    public entry fun toggleSubOnlyForLiveStream(datahouse: &mut DataHouse, ctx:&TxContext){
        let sender = tx_context::sender(ctx);
        let senderUsername = table::borrow(&datahouse.addressToUsername, sender);
        let profileId = table::borrow(&datahouse.usernameToProfile, *senderUsername);
        let profile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *profileId);
        if (profile.isOnlySubscribers == true) {
            profile.isOnlySubscribers = false;
        } else {
            profile.isOnlySubscribers = true;
        };
    }

    /// Session Functions
    public entry fun addStream(datahouse: &mut DataHouse, streamNftId:u128, sessionId: String, isSubscribersOnly: bool, ctx:&TxContext) {
        let sender = tx_context::sender(ctx);
        let creator = table::borrow(&datahouse.addressToUsername, sender);
        let stream = Stream{
            id: streamNftId,
            creator: *creator,
            sessionId: sessionId,
            views: 0,
            isSubscribersOnly: false,
        };
        table::add(&mut datahouse.streams, streamNftId, stream);
        vec_set::insert(&mut datahouse.isPublished, sessionId);

        event::emit(EventStreamPublished{
            streamNftId: streamNftId,
            creator: sender,
        });
    }

    public entry fun sessionViewIncrement(datahouse: &mut DataHouse, streamNftId:u128, ctx:&TxContext) {
        let sender = tx_context::sender(ctx);
        let stream = table::borrow_mut(&mut datahouse.streams, streamNftId);
        if (stream.isSubscribersOnly == true) {
            let subscriptionsTable = table::borrow_mut<address,  Table<String, Subscription>>(&mut datahouse.subscriptions, sender);
            assert!(table::contains(subscriptionsTable, stream.creator)==true, 0);
        };
        stream.views = stream.views + 1;

        event::emit(EventVideoViewed{
            id: streamNftId,
            viewer: sender,
        });
    }

    public entry fun toggleSubOnlyForPublishedStream(datahouse: &mut DataHouse, streamNftId:u128, ctx:&TxContext){
        let sender = tx_context::sender(ctx);
        let senderUsername = table::borrow(&datahouse.addressToUsername, sender);
        let stream = table::borrow_mut(&mut datahouse.streams, streamNftId);
        assert!(stream.creator == *senderUsername, EUnauthorized);
        if (stream.isSubscribersOnly == true) {
            stream.isSubscribersOnly = false;
        } else {
            stream.isSubscribersOnly = true;
        }
    }

    /// Comments Function
    public entry fun addComment(topic:String, message:String, datahouse: &mut DataHouse, clock: &Clock, ctx:&TxContext) {
        let sender = tx_context::sender(ctx);
        let comments = table::borrow_mut(&mut datahouse.commentsByTopic, topic);
        let comment = Comment {
            topic: topic,
            message: message,
            senderAddress: sender,
            senderUsername: *(table::borrow(&datahouse.addressToUsername, sender)),
            createdAt: clock::timestamp_ms(clock),
        };
        vector::push_back(comments, comment);

        event::emit(EventCommentAdded{
            topic: topic,
            position: vector::length(comments),
        });
    }

    public entry fun subscribe(toUsername:String, flowRate:u128, datahouse: &mut DataHouse, clock: &Clock, ctx:&mut TxContext) {
        let sender = tx_context::sender(ctx);
        if (table::contains(&datahouse.subscriptions, sender) == false) {
            table::add(&mut datahouse.subscriptions, sender, table::new(ctx));
        };
        {
            let subscriptionsTable = table::borrow_mut<address,  Table<String, Subscription>>(&mut datahouse.subscriptions, sender);
            assert!(table::contains(subscriptionsTable, toUsername)==false, ESubscriptionExist);
        };

        let toProfileId = table::borrow(&datahouse.usernameToProfile, toUsername);
        let toProfile = dof::borrow_mut<ID, Profile>(&mut datahouse.id, *toProfileId);
        assert!(toProfile.subscriptionCharge <= flowRate, 0);

        let subscription = Subscription{
            startedAt: clock::timestamp_ms(clock),
            flowRate: flowRate,
            toUsername: toUsername,
            toAddress: toProfile.owner,
            fromAddress: sender,
        };
        toProfile.subscribersCount = 1;
       
        let senderSubscriptions = table::borrow_mut(&mut datahouse.subscriptions, sender);
        table::add(senderSubscriptions, toUsername, subscription);

        event::emit(EventSubscribed{
            from: sender,
            toAddress: toProfile.owner,
            toUsername: toProfile.username,
            flowRate: flowRate,
        });
    }

    public entry fun unsubscribe(toUsername:String, datahouse: &mut DataHouse, ctx: &TxContext){
       let sender = tx_context::sender(ctx);
       assert!(table::contains(&datahouse.subscriptions, sender)==true, ESubscriptionNotExist);
       {
            let subscriptionsTable = table::borrow_mut<address,  Table<String, Subscription>>(&mut datahouse.subscriptions, sender);
            assert!(table::contains(subscriptionsTable, toUsername)==true, ESubscriptionNotExist);
        };
       let senderSubscriptions = table::borrow_mut(&mut datahouse.subscriptions, sender);
       table::remove(senderSubscriptions, toUsername);

       event::emit(EventUnsubscribed{
            subscriber: sender,
            creator: toUsername,
       });
    }
}