import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Story = {
    id : Nat;
    title : Text;
    content : Text;
  };

  let stories = Map.empty<Nat, Story>();
  var nextId = 0;

  module Story {
    public func compare(a : Story, b : Story) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public shared ({ caller }) func addStory(title : Text, content : Text) : async () {
    if (stories.size() >= 20) {
      Runtime.trap("Cannot add more than 20 stories.");
    };
    let story : Story = {
      id = nextId;
      title;
      content;
    };
    stories.add(nextId, story);
    nextId += 1;
  };

  public query ({ caller }) func getStory(id : Nat) : async ?Story {
    stories.get(id);
  };

  public query ({ caller }) func getAllStories() : async [Story] {
    stories.values().toArray().sort();
  };
};
