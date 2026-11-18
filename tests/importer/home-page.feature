@importer
Feature: Home page

  Scenario: Home page loads
    Given I am on the importer home page
    Then the page title is "Import fish and fishery products | trade-imports-fish-importer-fe"

  Scenario: Create a new import
    Given I am on the importer home page
    When I create a new import
    Then I am on the guidance page
