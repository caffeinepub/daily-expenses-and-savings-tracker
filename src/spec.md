# Specification

## Summary
**Goal:** Fix the Add Entry flow so signed-in users can create entries successfully, see them appear immediately, and receive clear English error messages when something goes wrong.

**Planned changes:**
- Fix backend authorization/role initialization so newly authenticated users reliably receive required “user” permissions for core actions (profiles, entries, dashboard, savings goals) without needing an admin secret.
- Repair the Add New Entry end-to-end flow so saving creates the entry and refreshes the Entries list (and dependent dashboard data) immediately without manual refresh, supporting multiple entries in sequence.
- Improve frontend error handling for entry creation to surface clear English messages for authentication/actor availability issues and backend authorization/trap errors, while keeping the existing success behavior and form reset.

**User-visible outcome:** After signing in with Internet Identity, users can add new entries without authorization failures, see the new entry appear right away (with updated related data), and get actionable English error messages if saving fails.
