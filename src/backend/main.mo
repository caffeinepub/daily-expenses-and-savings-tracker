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

  type SavingsGoal = {
    id : Nat;
    name : Text;
    targetAmount : Float;
    currentAmount : Float;
    deadline : ?Time.Time;
    note : ?Text;
    createdAt : Time.Time;
    lastModified : Time.Time;
  };

  module SavingsGoal {
    public func compare(a : SavingsGoal, b : SavingsGoal) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareByDeadline(a : SavingsGoal, b : SavingsGoal) : Order.Order {
      switch (a.deadline, b.deadline) {
        case (?aDeadline, ?bDeadline) { Int.compare(aDeadline, bDeadline) };
        case (?_, null) { #less };
        case (null, ?_) { #greater };
        case (null, null) { Nat.compare(a.id, b.id) };
      };
    };
  };

  let entryData = Map.empty<Principal, List.List<Entry>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let savingsGoals = Map.empty<Principal, List.List<SavingsGoal>>();
  var nextId = 0;
  var nextGoalId = 0;

  public shared ({ caller }) func registerUser(name : Text) : async () {
    userProfiles.add(caller, { name });
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addOrUpdateEntry(id : ?Nat, date : Time.Time, entryType : EntryType, amount : Float, category : ?Text, note : ?Text) : async Nat {
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
    let userId = caller;
    switch (entryData.get(userId)) {
      case (null) { [] };
      case (?entries) { entries.sort(Entry.compareByDate).toArray() };
    };
  };

  public query ({ caller }) func getDashboard() : async Dashboard {
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

  // Savings Goals

  public query ({ caller }) func getSavingsGoals() : async [SavingsGoal] {
    let userId = caller;
    switch (savingsGoals.get(userId)) {
      case (null) { [] };
      case (?goals) { goals.sort(SavingsGoal.compareByDeadline).toArray() };
    };
  };

  public shared ({ caller }) func addOrUpdateSavingsGoal(id : ?Nat, name : Text, targetAmount : Float, currentAmount : Float, deadline : ?Time.Time, note : ?Text) : async Nat {
    let userId = caller;
    let now = Time.now();

    let goals = switch (savingsGoals.get(userId)) {
      case (null) { List.empty<SavingsGoal>() };
      case (?existingGoals) { existingGoals };
    };

    switch (id) {
      case (null) {
        let newId = nextGoalId;
        let newGoal = {
          id = newId;
          name;
          targetAmount;
          currentAmount;
          deadline;
          note;
          createdAt = now;
          lastModified = now;
        };
        goals.add(newGoal);
        savingsGoals.add(userId, goals);
        nextGoalId += 1;
        newId;
      };
      case (?existingId) {
        let goalsArray = goals.toArray();
        let existingGoalIndex = goalsArray.findIndex(func(g) { g.id == existingId });
        switch (existingGoalIndex) {
          case (null) {
            let newGoal = {
              id = existingId;
              name;
              targetAmount;
              currentAmount;
              deadline;
              note;
              createdAt = now;
              lastModified = now;
            };
            goals.add(newGoal);
            savingsGoals.add(userId, goals);
            existingId;
          };
          case (?idx) {
            let goalArray = goalsArray.filter(func(g) { g.id != existingId });
            let existingGoal = goalsArray[idx];
            let updatedGoal = {
              existingGoal with
              name;
              targetAmount;
              currentAmount;
              deadline;
              note;
              lastModified = now;
            };
            let newGoals = List.fromArray<SavingsGoal>(goalArray);
            newGoals.add(updatedGoal);
            savingsGoals.add(userId, newGoals);
            existingId;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteSavingsGoal(id : Nat) : async () {
    let userId = caller;
    let goals = switch (savingsGoals.get(userId)) {
      case (null) { Runtime.trap("Savings goal not found") };
      case (?existingGoals) { existingGoals };
    };

    let goalsArray = goals.toArray();
    let goalIndex = goalsArray.findIndex(func(g) { g.id == id });

    switch (goalIndex) {
      case (null) { Runtime.trap("Savings goal not found") };
      case (?idx) {
        let newGoalsArray = goalsArray.filter(func(g) { g.id != id });
        let newGoals = List.fromArray<SavingsGoal>(newGoalsArray);
        savingsGoals.add(userId, newGoals);
      };
    };
  };
};
