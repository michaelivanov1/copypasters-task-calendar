A fullstack task tracking app with user specific growth stats.

Users can login/register with hashed passwords and then start adding tasks to either a calendar by double clicking on a tile, or adding task to a task list view.

Users will input task name, description, priority of task, color (for calendar view), due date, and difficulty. Upon clicking save button the task will be saved to a MongoDB database,
and also displayed in the calendar view, along with the task list view. 

Created tasks are editable/deletable. Tasks can be marked as complete which will remove them from the calendar/task list view and add them to a "completed tasks" view.

When a user completes a task before its due date they will gain a point. else lose a point. A "growth stats" component displays a graph based on the users points. 

Group members:

Luke Bas,
Dylan Mahyuddin,
Mahan Mehdipour,
Behnaz Najafi,
Juliette R Hope Golbahar Poirier-Mozun,
Michael Ivanov
