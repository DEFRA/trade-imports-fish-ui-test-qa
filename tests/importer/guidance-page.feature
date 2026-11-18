@importer
Feature: Guidance page

  Scenario: Guidance page shows its heading
    Given I open the guidance page
    Then I am on the guidance page
    And the page heading is "Submit your seafood import notification"

  Scenario: Start the notification from the guidance page
    Given I open the guidance page
    When I start the notification
    Then I am on the transport details page
