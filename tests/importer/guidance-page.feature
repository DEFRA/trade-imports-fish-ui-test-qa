@importer
Feature: Guidance page

  Scenario: Guidance page shows its heading
    Given I open the guidance page
    Then I am on the guidance page
    And the page heading is "Submit your seafood import notification"

  Scenario: Start now from the guidance page
    Given I open the guidance page
    When I click Start now
    Then I am on the transport details page
