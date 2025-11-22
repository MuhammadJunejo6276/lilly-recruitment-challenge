## Approach

To begin this challenge, I first reviewed the project structure and the code that was already provided in the repository. This helped me understand what was already implemented and what still required development. From there, I wrote down the objectives and broke the work into smaller steps so I could complete one part at a time and test as I progressed.

To support my work, I used concepts from modules I studied in previous semesters, along with material from my ongoing full-stack development course. Whenever I needed clarification on JavaScript methods, DOM manipulation, or API requests, I referred to MDN Web Docs. For the backend behaviour and form handling, I referred to the FastAPI documentation.

My general workflow was:
	1.	Understand each requirement.
	2.	Implement or fix the functionality.
	3.	Test the feature end to end.
	4.	Commit changes in clear, small steps

## Objectives - Innovative Solutions

Although some folders and partial code were already provided, I implemented the missing functionality, corrected issues, and added improvements where necessary.

One of the main achievements was completing full CRUD behaviour on both the frontend and backend. I created the create, update, and delete forms on the frontend and connected them with the correct endpoints. I also improved the error and success feedback so the user is clearly informed about what happens after each action.

I added validation to prevent adding duplicate medicines. This was handled directly in the backend by checking existing entries before inserting a new one.

I implemented a search feature to allow users to filter medicines by name instantly. Alongside this, I added a sorting dropdown that allows sorting by name (A–Z, Z–A) and by price (ascending or descending). These features work together through the same rendering function so the UI updates consistently.

Additionally, I added an “Average Price” button that fetches and displays the average price of all medicines using the backend endpoint.

For the UI, I made adjustments to ensure the inventory displays on the right side as intended. I kept the provided CSS untouched and applied all layout changes in my own custom CSS section. I also cleaned up the HTML where necessary to fix structure and ensure the CSS grid behaved as expected.

## Problems Faced

One of the first challenges was that VS Code highlighted missing imports for FastAPI stating that Import "fastapi" could not be resolved. This happened because no interpreter was set, so I fixed this by creating and activating a venv and installing dependencies by running these commands python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn

At one stage, the inventory was not appearing on the UI. This was caused by a wrong variable name (BASE_URL_URL instead of BASE_URL) because i was taking some content from my last semester module. After correcting it, the fetch calls worked properly.

I used chmod +x start.sh to make the startup script executable, otherwise macOS wouldn’t let me run it, but terminal showing error ([Errno 48] address already in use), I recognised that this meant another process was occupying port 8000. To confirm the exact process ID, I searched online for the correct MacOS command and used (lsof -i :8000) and then Then I terminated the process (kill <PID>)

![alt text](<Screenshot 2025-11-22 at 21.12.18.png>)

While doing some testing i saw backend allowed adding medicines with the same name.
I fixed this by adding a backend check using case-insensitive comparison and a simple frontend prompt to avoid duplicate submissions.

## Evaluation

Overall, the challenge was a positive experience and a good exercise in working with an existing codebase. Some features were partially implemented, while others needed full development or debugging. Completing CRUD functionality, adding validation, search, sorting, and the average calculation required careful testing and adjustments, which improved the reliability and user experience of the application.

If I had more time, I would consider extending the project to use a database instead of a JSON file, implementing basic unit tests, and enhancing the user interface further. I would also explore features such as editing items directly within the inventory list and adding more input validation.

Even though the task was described as a 60-minute challenge, ensuring everything worked correctly and cleanly took longer, especially when debugging and improving user experience. However, the extra time allowed me to deliver a well tested and well structured solution.