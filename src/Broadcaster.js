var privates = {
  'currentId': -1
};

class Broadcaster {

  constructor () {

    this.eventSubscriptions = {};
    this.mute = false;

  }

  set uniqueId ( _ ) {

    throw '`uniqueId` is a private, read-only property and cannot be assigned a value';

  }

  get uniqueId () {

    return ++privates.currentId;
  
  }

  subscribe ( eventName, callbackFunction ) {

    //  Allow other objects to subscribe to custom events that
    //  are broadcasted through this class's `notify` method

    let id = this.uniqueId;

    this.eventSubscriptions[ eventName ] = this.eventSubscriptions[ eventName ] || [];

    this.eventSubscriptions[ eventName ].push(
      { 'id': id, 'callback': callbackFunction }
    );

    // Return id so specific subscription can be referenced later
    return id;

  }

  unsubscribe ( id ) {

    //  Allow other objects to unsubscribe a specific subscription

    let unsubscribed;

    Object.keys( this.eventSubscriptions ).forEach( key => {

      this.eventSubscriptions[ key ].forEach( (subscription, index) => {
        if ( subscription.id === id ) {
          unsubscribed = this.eventSubscriptions[ key ].splice( index, 1 );
        }
      });

      // clean house if there are no longer any subscriptions for this event
      if ( !this.eventSubscriptions[key].length ) {
        delete this.eventSubscriptions[key];
      }

    });

    return unsubscribed;

  }

  notify ( eventName, data ) {

    //  Fires each "subscription" (made through a call to `subscribe`)
    //  for a given eventName. Optionally sends data to the subscription's
    //  callback function

    if ( this.mute )
      return

    if ( !this.eventSubscriptions[ eventName ] )
      return;

    this.eventSubscriptions[ eventName ].forEach( s => {
      setTimeout( () => s.callback( data ), 0 );
    });

    return;

  }

  mute () {
    return this.mute = true;
  }

  unmute () {
    return this.mute = false;
  }

}

export default Broadcaster