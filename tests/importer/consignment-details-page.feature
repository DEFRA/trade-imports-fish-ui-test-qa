@importer
Feature: Consignment details page - arrival details

  # Every scenario starts on the Consignment details page, reached by signing in, starting a new import
  # and saving a transport method. The error text is provisional until content review,
  # so these checks will need updating when the final wording is agreed

  Background:
    Given I am signed in as "North Quay Importer"
    And I start a new import
    And I select the transport method "Ship or vessel" and save and continue

  # --- Page content ---

  Scenario: The page asks for the port of entry, arrival date and arrival time
    Then I am on the consignment details page
    And the page heading is "Consignment details"

  # --- All arrival details missing ---

  Scenario: Saving without any arrival details shows an error for each field
    When I save and continue
    Then I am on the consignment details page
    And the error summary says "Select a port of entry from the list"
    And the error summary says "Enter the expected date of arrival"
    And the error summary says "Enter the expected time of arrival"
    And the field errors say "Select a port of entry from the list", "Enter the expected date of arrival" and "Enter the expected time of arrival"

  # --- Port of entry ---

  # This is the list at the time of writing, not a rule. It comes from MDM and will be narrowed later
  Scenario: The port of entry list shows the current ports
    Then the port of entry options are "Dover, Felixstowe, Grimsby, Hull, Immingham, Liverpool, Portsmouth, Tilbury"

  Scenario: Saving without a port of entry shows an error
    When I enter the arrival date of "tomorrow"
    And I enter the arrival time hour "09" minute "30"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "Select a port of entry from the list"
    And the field error says "Select a port of entry from the list"

  # --- Arrival date ---

  Scenario: Saving without an arrival date shows an error
    When I select the port of entry "Dover"
    And I enter the arrival time hour "09" minute "30"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "Enter the expected date of arrival"
    And the field error says "Enter the expected date of arrival"

  # A real date has a real day and month, a 4-digit year and all three parts
  Scenario Outline: An invalid arrival date shows an error
    When I select the port of entry "Dover"
    And I enter the arrival date day "<day>" month "<month>" year "<year>"
    And I enter the arrival time hour "09" minute "30"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "<error>"

    Examples:
      | day | month | year | error                                                      |
      | 31  | 2     | 2027 | The expected date of arrival must be a real date           |
      | 1   | 13    | 2027 | The expected date of arrival must be a real date           |
      | ab  | 1     | 2027 | The expected date of arrival must be a real date           |
      | 1   | 1     | 27   | Year must include 4 numbers                                |
      | 5   |       |      | The expected date of arrival must include a month and year |

  Scenario: An arrival date in the past is rejected
    When I select the port of entry "Dover"
    And I enter the arrival date of "yesterday"
    And I enter the arrival time hour "09" minute "30"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "The expected date and time of arrival must be at least 2 hours in the future"

  # --- Arrival time ---

  # The hint tells the user to use the 24-hour clock
  Scenario: The arrival time hint gives a 24-hour clock example
    Then the arrival time hint says "For example, 09:30 or 14:30"

  Scenario: Saving without an arrival time shows an error
    When I select the port of entry "Dover"
    And I enter the arrival date of "tomorrow"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "Enter the expected time of arrival"
    And the field error says "Enter the expected time of arrival"

  # The hour must be 0 to 23 and the minute 0 to 59, with both parts entered
  Scenario Outline: An invalid arrival time shows an error
    When I select the port of entry "Dover"
    And I enter the arrival date of "tomorrow"
    And I enter the arrival time hour "<hour>" minute "<minute>"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "<error>"

    Examples:
      | hour | minute | error                                                             |
      | 24   | 00     | Enter a time using an hour from 0 to 23 and a minute from 0 to 59 |
      | 25   | 00     | Enter a time using an hour from 0 to 23 and a minute from 0 to 59 |
      | 09   | 60     | Enter a time using an hour from 0 to 23 and a minute from 0 to 59 |
      | ab   | 30     | Enter a time using an hour from 0 to 23 and a minute from 0 to 59 |
      | 09   |        | The expected time of arrival must include a minute                |

  # Today at 00:00 is always in the past, whatever time the test runs, so it never depends on the clock
  Scenario: An arrival time earlier today is rejected
    When I select the port of entry "Dover"
    And I enter the arrival date of "today"
    And I enter the arrival time hour "00" minute "00"
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "The expected date and time of arrival must be at least 2 hours in the future"

  # The service needs more than 2 hours' notice. Seconds are dropped when a time is typed, so 119 minutes
  # is always under the cutoff and 180 minutes always over it, whatever second the test runs
  Scenario: An arrival just under 2 hours from now is rejected
    When I select the port of entry "Dover"
    And I enter an arrival date and time 119 minutes from now
    And I save and continue
    Then I am on the consignment details page
    And the error summary says "The expected date and time of arrival must be at least 2 hours in the future"

  Scenario: An arrival more than 2 hours from now is accepted
    When I select the port of entry "Dover"
    And I enter an arrival date and time 180 minutes from now
    And I save and continue
    Then I am on the next step page

  Scenario: Today is accepted with a time more than 2 hours ahead
    When I select the port of entry "Dover"
    And I enter today as the arrival date with a time 3 hours from now
    And I save and continue
    Then I am on the next step page

  # Tomorrow is always far enough ahead, so the first, a mid-day and the last minute of the day all pass
  Scenario Outline: Arrival times across the 24-hour clock are accepted
    When I select the port of entry "Dover"
    And I enter the arrival date of "tomorrow"
    And I enter the arrival time hour "<hour>" minute "<minute>"
    And I save and continue
    Then I am on the next step page

    Examples:
      | hour | minute |
      | 00   | 00     |
      | 09   | 30     |
      | 23   | 59     |

  # --- Saving and amending ---

  # Reopening the page goes straight to the saved draft, which shows what was saved
  Scenario: Valid arrival details are saved and the user moves on
    When I select the port of entry "Felixstowe"
    And I enter the arrival date of "tomorrow"
    And I enter the arrival time hour "14" minute "30"
    And I save and continue
    Then I am on the next step page
    When I reopen the consignment details page
    Then the port of entry is "Felixstowe"
    And the arrival date is "tomorrow"
    And the arrival time is hour "14" minute "30"

  Scenario: Arrival details can be changed and saved again before submission
    Given I select the port of entry "Dover"
    And I enter the arrival date of "tomorrow"
    And I enter the arrival time hour "09" minute "30"
    And I save and continue
    When I reopen the consignment details page
    And I select the port of entry "Tilbury"
    And I enter the arrival time hour "18" minute "45"
    And I save and continue
    Then I am on the next step page
    When I reopen the consignment details page
    Then the port of entry is "Tilbury"
    And the arrival date is "tomorrow"
    And the arrival time is hour "18" minute "45"
