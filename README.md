# Resume Portal - Features and Updates

## Features:

-   **User Authentication:**
    -   Login and Logout functionality.
    -   Google Login.
    -   Password visibility toggle.
    -   User profile display.
    -   Session management.
-   **Resume Upload:**
    -   Resume upload card.
    -   File selection validation.
    -   Category selection validation (users must select at least one category).
    -   File upload to Supabase storage.
    -   Dynamic categories from sidebar.
-   **Metadata Storage:**
    -   Resume metadata insertion into the `resume_metadata` table.
    -   Stores user ID, email, filename, file URL, selected categories, and upload timestamp.
-   **File Naming Convention:**
    -   Files are stored with the user's name and timestamp to avoid naming conflicts.
-   **Sidebar:**
    -   Toggle sidebar functionality.
    -   Categories for different job roles.

## Updates:

-   Implemented user authentication using Supabase.
-   Added resume upload functionality with category selection.
-   Stored resume metadata in Supabase.
-   Implemented file naming convention.
-   Fixed file upload issues and added detailed error logging.
-   Resolved 403 error by configuring RLS policies on the `resume_metadata` table.
-   Added favicon to the project.

## Future Enhancements:

-   Implement more robust error handling.
-   Add loading indicators during asynchronous operations.
-   Implement client-side validation to prevent malicious input.
-   Consider using Supabase's real-time capabilities to update the UI.
-   Refactor the code into smaller, more manageable functions.
