@importer
Feature: Home page

  Scenario: Home page loads
    Given I am on the importer home page
    Then the page title is "Import fish and fishery products | trade-imports-fish-importer-fe"

  Scenario: Start a new import notification
    Given I am on the importer home page
    When I start a new import notification
    Then I am on the guidance page
