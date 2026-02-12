import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type EntryType = { #expense; #saving };

  type Entry = {
    id : Nat;
    date : Time.Time;
    entryType : EntryType;
    amount : Float;
    category : ?Text;
    note : ?Text;
  };

  module Entry {
    public func compare(a : Entry, b : Entry) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareByDate(a : Entry, b : Entry) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  public type EntrySummary = {
    totalExpenses : Float;
    totalSavings : Float;
    netBalance : Float;
  };

  public type CategoryBreakdown = {
    category : Text;
    total : Float;
  };

  public type Dashboard = {
    summary : EntrySummary;
    categoryBreakdown : [CategoryBreakdown];
  };

  public type UserProfile = {
    name : Text;
  };

  let entryData = Map.empty<Principal, List.List<Entry>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addOrUpdateEntry(id : ?Nat, date : Time.Time, entryType : EntryType, amount : Float, category : ?Text, note : ?Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add entries");
    };

    let userId = caller;
    let entries = switch (entryData.get(userId)) {
      case (null) { List.empty<Entry>() };
      case (?existingEntries) { existingEntries };
    };

    switch (id) {
      case (null) {
        let newId = nextId;
        let newEntry = {
          id = newId;
          date;
          entryType;
          amount;
          category;
          note;
        };
        entries.add(newEntry);
        entryData.add(userId, entries);
        nextId += 1;
        newId;
      };
      case (?existingId) {
        let entriesArray = entries.toArray();
        let existingEntryIndex = entriesArray.findIndex(func(e) { e.id == existingId });
        switch (existingEntryIndex) {
          case (null) {
            let newEntry = {
              id = existingId;
              date;
              entryType;
              amount;
              category;
              note;
            };
            entries.add(newEntry);
            entryData.add(userId, entries);
            existingId;
          };
          case (?idx) {
            let newEntriesArray = entriesArray.filter(
              func(e) { e.id != existingId }
            );
            let updatedEntry = {
              id = existingId;
              date;
              entryType;
              amount;
              category;
              note;
            };
            let newEntries = List.fromArray<Entry>(newEntriesArray);
            newEntries.add(updatedEntry);
            entryData.add(userId, newEntries);
            existingId;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteEntry(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete entries");
    };

    let userId = caller;
    let entries = switch (entryData.get(userId)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?existingEntries) { existingEntries };
    };

    let entriesArray = entries.toArray();
    let entryIndex = entriesArray.findIndex(func(e) { e.id == id });

    switch (entryIndex) {
      case (null) { Runtime.trap("Entry not found") };
      case (?idx) {
        let newEntriesArray = entriesArray.filter(
          func(e) { e.id != id }
        );
        let newEntries = List.fromArray<Entry>(newEntriesArray);
        entryData.add(userId, newEntries);
      };
    };
  };

  public query ({ caller }) func getEntries() : async [Entry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view entries");
    };

    let userId = caller;
    switch (entryData.get(userId)) {
      case (null) { [] };
      case (?entries) { entries.sort(Entry.compareByDate).toArray() };
    };
  };

  public query ({ caller }) func getDashboard() : async Dashboard {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };

    let userId = caller;
    let entries = switch (entryData.get(userId)) {
      case (null) { List.empty<Entry>() };
      case (?existingEntries) { existingEntries };
    };

    let entriesArray = entries.toArray();
    if (entriesArray.size() == 0) {
      return {
        summary = { totalExpenses = 0.0; totalSavings = 0.0; netBalance = 0.0 };
        categoryBreakdown = [];
      };
    };

    let totals = entriesArray.foldLeft(
      (0.0, 0.0),
      func(acc, entry) {
        let (expenses, savings) = acc;
        switch (entry.entryType) {
          case (#expense) { (expenses + entry.amount, savings) };
          case (#saving) { (expenses, savings + entry.amount) };
        };
      },
    );

    let (totalExpenses, totalSavings) = totals;
    let netBalance = totalSavings - totalExpenses;

    let breakdownMap = Map.empty<Text, Float>();
    entriesArray.forEach(func(entry) {
      switch (entry.category) {
        case (?cat) {
          let currentTotal = switch (breakdownMap.get(cat)) {
            case (null) { 0.0 };
            case (?amount) { amount };
          };
          breakdownMap.add(cat, currentTotal + entry.amount);
        };
        case (null) {};
      };
    });

    let categoryBreakdown = breakdownMap.entries().toArray().map(
      func((category, total)) {
        { category; total };
      }
    );

    {
      summary = { totalExpenses; totalSavings; netBalance };
      categoryBreakdown;
    };
  };
};
