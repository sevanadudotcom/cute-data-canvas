# Dedicated RTI and Service Status Pages

## Build
- Convert the existing RTI filing wireframe into a full `/rti` page, preserving its form, BPL exemption, payment simulation, receipt, Hindi support, and locally saved reference number.
- Convert the existing application tracker wireframe into a full `/status` page, preserving reference lookup, saved RTI/application lookup, sample records, and milestone timeline.
- Restyle both experiences for the selected Modern Institutional theme, using a readable two-column desktop layout and a single-column mobile layout.
- Clearly label simulated filing, payment, tracking, and escalation actions so the independent portal cannot be mistaken for an official government submission system.

## Navigation
- Replace modal-opening actions in the top navigation with real links to `/rti` and `/status`.
- Keep the existing homepage controls unchanged beyond removing the obsolete modal state and mounts.
- Add a compact shared page header with links back to services and between RTI/status.

## Quality
- Add unique metadata for both pages.
- Verify form progression, receipt-to-status lookup, desktop and mobile layouts, and preview errors.
- Update the project roadmap. Lovable’s connected GitHub sync will receive the source changes automatically; no manual Git command will be run.

## Technical details
- Refactor each modal to support both modal and embedded-page presentation instead of duplicating its workflow logic.
- Keep browser-local storage compatibility with existing keys (`sewanadu_rtis`, `sewanadu_applications`).
- Use TanStack Router `Link` navigation and create both route files in the same change.
