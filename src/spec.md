# Specification

## Summary
**Goal:** Make Category selection type-specific and mandatory for entries, and improve UI text contrast/readability over the existing background by removing explicit black text styling.

**Planned changes:**
- Replace the shared Category list with two exported, alphabetically sorted constants lists: one for **Expense** (AK Expenses, EB Bill, Internet Bill, Mobile Bill, Online Shopping, Snacks) and one for **Saving** (FD, PPF, RD, SIP, Saving Box).
- Update **Add New Entry** so Category is required and the dropdown shown depends on selected Type (Expense vs Saving); switching Type clears an invalid prior Category and blocks submit until valid.
- Update **Edit Entry** dialog similarly: Category required, type-specific dropdown, switching Type clears invalid prior Category, and saving is blocked until valid.
- Remove explicit black text styling across the UI and ensure text uses theme-driven tokens (foreground/muted-foreground/etc.); adjust overlay/theme variables if needed so text is readable over the current background on Dashboard, Entries, Download APK, and sign-in.

**User-visible outcome:** Users must choose a Category when adding/editing an entry, with category options changing based on whether the entry is an Expense or a Saving, and the app’s text is consistently readable over the existing background image across main screens and dialogs.
