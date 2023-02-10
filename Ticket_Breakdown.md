# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

First, I'll restate the problem

DB TABLES
=========
-facilities
-agents
-shifts

getShiftsByFacility(facilityID) => []shifts{agentMetadata}

generateReport([]shifts) => makes a PDF ...for compliance

OK right now:
-there is a PrimaryKey of ID for each agent.
-the facilities need their own key for each agent

=====
2-5 TICKETS BREAKDOWN
====
TICKET 1: Add a table facility_foreign_keys with the columns agent_id, facility_id, facility_external_agent_id 
(simple, can push to production after approval in 1 worksession)

TICKET 2: This wasn't specific in the problem, but we need to add to our application some way for the facilities to import and map their external IDs to the existing batch of agent IDs already in our system. This is a complex problem with importing, storage, a new application control page, and lots of strange data-importing data-matching edge cases to handle and push to our live application. This needs to be broken down into a kanban or other multiple smaller tickets once assigned.
(complex, will need multiple approvals, will take weeks)

TICKET 3: Add the facility-specific external IDs of agents to getShiftsByFacility(facilityID)
- Refactor getShiftsByFacility so that the agentMetadata when it gets joined
  also joins `facility_external_agent_id` from the table `facility_foreign_keys`
  where facilityID == facility_id AND agent_id == this_shift_row.agent_id
(medium difficultly, will need edge case and data model testing, and perhaps a deeper look from someone who excels are SQL edge case testing)

TICKET 4: generateReport() should publish the facility-specific external IDs of agents into the PDF
- Make sure they are prominent because clearly the facilities care about this ID more than our internal ID
- Make sure to catch the cases in which migration hasn't completed
- This point will require user testing and user feedback since this will be the main experience of the new feature for users
(simple but involved the end-to-end testing, needs final in-situ approval from managers after test rollout and feedback)