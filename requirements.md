REQUIREMENTS LIST

Functional Requirements:
    * The site will allow the intended users to log in (reader, teacher, admin/staff, parent(?))
        - Should there be only 1 profile associated with a student's reader, or should, for example, a parent of a student can have a profile at the same time as a brother for the student. The former is simpler, and we can maybe just implement a simple drop-down box or other option to distinguish readers when logging student progress.
    * The site will allow an admin/staff user to easily create and administer weekly forms for the students to take
    * Form creation shall allow the use of multiple choice questions as well as open-ended questions
    * Form creation shall allow reference answers to be inputted to be shown to readers/students after they complete the form
    * Form creation should allow the use of embedded Youtube videos and maybe other common file types (mp3, mp4, etc.)
        - Need to clarify what all the project partner deems necessary.
    * The site shall allow an admin/staff user to easily review and change weekly forms before and after they have been published
    * The site should allow a user to easily view previous forms
    * The site shall allow the reader/student to access/view/complete the weekly form
    * The reader shall be able to access reference answers provided for the form questions.
    * The site shall allow the reader to easily and intuitively access/view/log student reading progress.
    * Admins/Teachers shall only be able to view information about assigned students.
    * The site should be visually appealing to the student and the intended young reader
    * Readers/Students shall be able to view their raffle entries
    * At the end of each raffle period, a winner shall be determined randomly.
    * Above winner as well as necessary admin shall be contacted upon winning.


Non-Functional Requirements:
    * The site shall be able to easily handle all daily active users at once (estimation needed)
    * The site shall ONLY allow users to access necessary information and functions relative to their role and associated student
    * The site should use Magic Links to make auth easier for the end user
    * Weekly Form data shall be stored for each student for progress tracking
    * Reading log data shall be stored for each student for progress tracking purposes
    * When completing a form, the reader/student shall only be able to view the reference answers AFTER submitting their form.
    * Raffle winner selection process shall be hidden from readers and users, but not from admin
    * Raffle winner contact should automatically send out an email using associated user profile email and other contact information

'*' items are requirements, items begining with '-' are notes/questions about the above requirement to be reviewed