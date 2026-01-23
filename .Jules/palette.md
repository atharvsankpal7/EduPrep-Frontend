## 2024-05-21 - Data Mapping Mismatches in Paginated Components
**Learning:** Components handling subsets of data (like `QuestionNavigation` for a single test section) often receive global state (like `answers` map) without transformation. This leads to silent UX bugs where state (answered status) is visualized incorrectly or not at all.
**Action:** Always verify if child components expect local or global indices. If local, transform the data in the parent before passing it down, or ensure the child component has enough context (like an offset) to perform the mapping itself.
